<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <h2>Dashboard</h2>
        <v-card class="pa-2 my-3">
            <v-card-text>
                <v-row>

                    <v-col cols="12" lg="3" md="4" sm="6">
                        <v-card elevation="8" style="background-color: #00640d;">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between pa-2">
                                    <span style="font-size: 40px;" class="text-color-primary"><v-icon>mdi-human-white-cane</v-icon></span>
                                    <div class="d-flex flex-column align-start">
                                        <span style="font-size: 20px;" class="text-white">{{ totalSeniorsCount }}</span>
                                        <span style="font-size: 13px;" class="text-grey-lighten-1">Senior Citizens</span>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" lg="3" md="4" sm="6">
                        <v-card elevation="8" style="background-color: #cc6300;">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between pa-2">
                                    <span style="font-size: 40px;" class="text-color-primary"><v-icon>mdi-wheelchair</v-icon></span>
                                    <div class="d-flex flex-column align-start">
                                        <span style="font-size: 20px;" class="text-white">{{ totalPWDCount }}</span>
                                        <span style="font-size: 13px;" class="text-grey-lighten-1">PWDs</span>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" lg="3" md="4" sm="6">
                        <v-card @click="toAllBenef" elevation="8" style="background-color: #c58d00;">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between pa-2">
                                    <span style="font-size: 40px;" class="text-color-primary"><v-icon>mdi-account-group-outline</v-icon></span>
                                    <div class="d-flex flex-column align-start">
                                        <span style="font-size: 20px;" class="text-white">{{ totalBenefCount }}</span>
                                        <span style="font-size: 13px;" class="text-grey-lighten-1">All Benefeciaries</span>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                    <v-col cols="12" lg="3" md="4" sm="6">
                        <v-card @click="toAllHandOver" elevation="8" style="background-color: #b6003d;">
                            <v-card-text>
                                <div class="d-flex align-center justify-space-between pa-2">
                                    <span style="font-size: 40px;" class="text-color-primary"><v-icon>mdi-hand-heart-outline</v-icon></span>
                                    <div class="d-flex flex-column align-start">
                                        <span style="font-size: 20px;" class="text-white">{{ totalHandOverCount }}</span>
                                        <span style="font-size: 13px;" class="text-grey-lighten-1">Hand Overs</span>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>

                </v-row>
            </v-card-text>
        </v-card>
        <v-card>
            <v-card-text>
                <BarChart 
                    :total-benef-count="totalBenefCount"
                    :total-seniors-count="totalSeniorsCount"
                    :total-pwd-count="totalPWDCount"
                    :total-hand-over-count="totalHandOverCount"/>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useLoadingStore } from '@/stores/loading';
import BarChart from '@/components/BarChart.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Dashboard',

    components: {
        BarChart,
    },

    data() {
        return {
            totalBenefCount: null,
            totalPWDCount: null,
            totalSeniorsCount: null,
            totalHandOverCount: null,
        };
    },

    setup() {
        const benefeciaryStore = useBenefeciaryStore();
        const loadingStore = useLoadingStore();
        const currentDate = new Date().toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        const formatCurrentDate = currentDate.replace(/,/g, '');
        return {
            benefeciaryStore,
            loadingStore,
            formatCurrentDate,
        };
    },

    mounted() {
        this.loadAllData();
    },

    methods: {
        toAllBenef() {
            this.$router.push('/all-benefeciaries');
        },

        toAllHandOver() {
            this.$router.push('/hand-overs');
        },

        async loadAllData() {
            try {
                this.loadingStore.show("");
                await Promise.all([
                    this.fetchTotalBenef(),
                    this.fetchTotalPWDS(),
                    this.fetchTotalSeniors(),
                    this.fetchTotalHandOvers(),
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                this.loadingStore.hide();
            }
        },

        async fetchTotalBenef() {
            try {
                await this.benefeciaryStore.fetchTotalBenefStore();
                this.totalBenefCount = Number(this.benefeciaryStore.benefCount.total_benefeciaries).toLocaleString('en-PH') || '';
            } catch (error) {
                console.error(error);
            }
        },

        async fetchTotalHandOvers() {
            try {
                await this.benefeciaryStore.fetchHandOverCountStore();
                this.totalHandOverCount = Number(this.benefeciaryStore.handOverCount.total_hand_overs).toLocaleString('en-PH') || '';
            } catch (error) {
                console.error(error);
            }
        },

        async fetchTotalSeniors() {
            try {
                await this.benefeciaryStore.fetchTotalSeniorsStore();
                this.totalSeniorsCount = Number(this.benefeciaryStore.seniorsCount.total_senior_citizen).toLocaleString('en-PH') || '';
            } catch (error) {
                console.error(error);
            }
        },

        async fetchTotalPWDS() {
            try {
                await this.benefeciaryStore.fetchTotalPWDStore();
                this.totalPWDCount = Number(this.benefeciaryStore.pwdCount.total_pwds).toLocaleString('en-PH') || '';
            } catch (error) {
                console.error(error);
            }
        },

    },
};
</script>