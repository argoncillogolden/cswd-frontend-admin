<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <h2>Reports</h2>

        <v-row>
            <v-col cols="12" lg="6" md="6" sm="6">
                <v-card class="px-3 pt-2 pb-5 my-3">
                    <PieChart :total-seniors-count="totalSeniorsCount" :total-pwd-count="totalPWDCount" />
                </v-card>
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="6">
                <v-card class="px-3 pt-2 pb-5 my-3">
                    <DoughnutChart :beneficiaries-data="beneficiaries" />
                </v-card>
            </v-col>
        </v-row>

        <v-card class="pa-2 my-3">
            <v-card-text>
                <BarChart :hand-over-dates-data="handOverDatesData" />
            </v-card-text>
        </v-card>

        <v-card class="my-3">
            <v-card-text>
                <BeneficiariesReport />
            </v-card-text>
        </v-card>

        <v-card class="my-3">
            <v-card-text>
                <HandOversReport />
            </v-card-text>
        </v-card>

    </v-container>
</template>

<script>
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useLoadingStore } from '@/stores/loading';
import BarChart from '@/components/BarChart.vue';
import PieChart from '@/components/PieChart.vue';
import DoughnutChart from '@/components/DoughnutChart.vue';
import BeneficiariesReport from '@/components/BeneficiariesReport.vue';
import HandOversReport from '@/components/HandOversReport.vue';


export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Reports',

    components: { 
        BarChart, 
        PieChart, 
        DoughnutChart, 
        BeneficiariesReport,
        HandOversReport },

    data() {
        return {
            beneficiaries: [],
            handOverDatesData: [],
            totalSeniorsCount: null,
            totalPWDCount: null,
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

        async loadAllData() {
            try {
                this.loadingStore.show("");
                await Promise.all([
                    this.fetchTotalSeniors(),
                    this.fetchTotalPWDS(),
                    this.fetchAllBeneficiaries(),
                    this.fetchHandOverDates(),
                ]);
            } catch (error) {
                console.error(error);
            } finally {
                this.loadingStore.hide();
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

        async fetchAllBeneficiaries() {
            try {
                await this.benefeciaryStore.fetchAllBenefStore();
                this.beneficiaries = this.benefeciaryStore.allBenefeciaries;
                if (this.beneficiaries && this.beneficiaries.length > 0) {
                    this.beneficiaries = this.beneficiaries.map(order => this.formatallBenef(order));
                }
                this.loadingAllBenef = false;
            } catch (error) {
                console.error(error);
                this.showError(error);
            }
        },

        async fetchHandOverDates() {
            try {
                await this.benefeciaryStore.fetchHandOverDatesStore();
                this.handOverDatesData = this.benefeciaryStore.allHandOverDates;
                if (this.handOverDatesData && this.handOverDatesData.length > 0) {
                    this.handOverDatesData = this.handOverDatesData.map(order => this.formatHandOverData(order));
                }
            } catch (error) {
                console.error(error);
                this.showError(error);
            }
        },

        formatallBenef(benef) {
            let benefSuffix = benef.suffix;
            if (benefSuffix !== null) {
                benefSuffix = benef.suffix;
            } else {
                benefSuffix = '';
            }
            return {
                ...benef,
                display_name: `${benef.first_name} ${benef.middle_name} ${benef.last_name}  ${benefSuffix}` || '',
                updated_at: benef.updated_at ? this.formatDateTime(benef.updated_at) : 'N/A',
            };
        },

        formatHandOverData(data) {
            return {
                ...data,
                updated_at: data.updated_at ? this.formatDateTime(data.updated_at) : 'N/A',
                designated_barangay: `Brgy. ${data.barangay_name}`.trim(),
            };
        },

        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            let date;
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
                date = new Date(dateString + 'T00:00:00');
            } else {
                date = new Date(dateString);
            }
            if (isNaN(date)) return 'N/A';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

    },
};
</script>