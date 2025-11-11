<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <h2>Add New Hand Over Schedule</h2>
        <v-icon @click="back" class="my-5" title="Back">mdi-arrow-left</v-icon>
        <v-form ref="benefeciaryForm" @submit.prevent="showConfirmDialog">
            <v-row>

                <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                    <v-text-field v-model="coordinator" label="Coordinator" variant="outlined" density="compact" />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                    <v-text-field v-model="hand_over_date" label="Date of Hand-over" @click="handOverDateDialog = true"
                        variant="outlined" density="compact" />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                    <v-autocomplete v-model="category_id" label="Benefeciary" :items="benefCategoryOption"
                        :rules="[v => !!v || 'Required']" item-title="category_label" item-value="category_id"
                        variant="outlined" density="compact" />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                    <v-text-field v-model="cash_amount" type="number" label="Cash amount per benefeciary"
                        variant="outlined" density="compact" />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                    <v-text-field v-model="venue" label="Venue" :rules="[v => !!v || 'Required']" variant="outlined"
                        density="compact" placeholder="e.g. Sagay City Gymnasium" />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                    <v-autocomplete v-model="address_line1" label="Designated Barangay" :items="barangayOption"
                        :rules="[v => !!v || 'Required']" item-title="barangay_name" item-value="barangay_id"
                        variant="outlined" density="compact" />
                </v-col>

                <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                    <v-text-field v-model="benefit_type" label="Type of AICS benefit" :rules="[v => !!v || 'Required']"
                        variant="outlined" density="compact" placeholder="e.g. Cash-for-Work Programme" />
                </v-col>

            </v-row>

            <v-row>
                <v-col cols="12">
                    <v-btn color="green" variant="tonal" prepend-icon="mdi-check"
                        :disabled="!isFormValid || validatingData" @click="showConfirmDialog">
                        Confirm
                    </v-btn>
                </v-col>
            </v-row>
        </v-form>

        <!-- Date Dialog -->
        <v-dialog v-model="handOverDateDialog" max-width="380px">
            <v-card>
                <v-card-title>
                    <span class="headline">Select date</span>
                </v-card-title>
                <v-card-text>
                    <v-date-picker v-model="hand_over_date" color="#005f5a" locale="en" scrollable>
                        <template #actions>
                            <v-btn text color="#005f5a" @click="handOverDateDialog = false">Close</v-btn>
                        </template>
                    </v-date-picker>
                </v-card-text>
            </v-card>
        </v-dialog>

        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center">Do you want to save new hand-over schedule?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-content-save"
                        @click="saveNewHandOver">Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Alert ref="alertRef" />
    </v-container>
</template>

<script>
import Alert from '@/components/Alert.vue';
import { computed } from 'vue';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useBenefOptionStore } from '@/stores/benefOptionStore';
import { useLoadingStore } from '@/stores/loading';


export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'NewHandOverSchedule',

    components: {
        Alert,
    },

    data() {
        return {
            validatingData: false,
            confirmDialog: false,
            handOverDateDialog: false,
            hand_over_date: '',
            coordinator: '',
            category_id: null,
            cash_amount: '',
            government_tier_id: null,
            venue: '',
            address_line1: null,
            address_line2: 'Sagay City',
            benefit_type: '',
        };
    },

    setup() {
        const benefeciaryStore = useBenefeciaryStore();
        const loadingStore = useLoadingStore();
        const benefOption = useBenefOptionStore();
        return {
            benefeciaryStore,
            loadingStore,
            benefOption,
            benefCategoryOption: computed(() => benefOption.benefCategoryOption),
            barangayOption: computed(() => benefOption.barangayOption),
        };
    },

    mounted() {
        this.loadOptions();
    },

    watch: {
        hand_over_date(newVal) {
            if (newVal) {
                this.handOverDateDialog = false;
                this.hand_over_date = this.formatDateTime(newVal);
            }
        },

    },

    computed: {
        isFormValid() {
            return (
                this.hand_over_date &&
                this.coordinator &&
                this.category_id &&
                this.cash_amount &&
                this.venue &&
                this.address_line1 &&
                this.address_line2 &&
                this.benefit_type
            );
        },
    },

    methods: {

        back() {
            this.$router.go(-1);
        },

        loadOptions() {
            this.benefOption.fetchcategoryOptions();
            this.benefOption.fetchBarangayOption();
        },

        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },

        closeConfirmDialog() {
            this.confirmDialog = false;
        },

        // Create New Hand-over Schedule
        async saveNewHandOver() {
            this.confirmDialog = false;
            try {
                this.loadingStore.show("Saving...");
                if (!this.$refs.benefeciaryForm.validate()) return;
                this.validatingData = true;
                const payload = new FormData();
                payload.append("hand_over_date", this.hand_over_date);
                payload.append("coordinator", this.coordinator);
                payload.append("category_id", this.category_id);
                payload.append("cash_amount", this.cash_amount);
                payload.append("venue", this.venue);
                payload.append("address_line1", this.address_line1);
                payload.append("address_line2", this.address_line2);
                payload.append("benefit_type", this.benefit_type);
                await this.benefeciaryStore.saveNewHandOverStore(payload);
                this.validatingData = false;
                this.showSuccess("New hand-over schedule successfully saved!");
                this.$refs.benefeciaryForm.reset();
                this.$router.push({ name: 'HandOvers' });
            } catch (error) {
                this.showError(error);
                console.error(error);
            } finally {
                this.validatingData = false;
                this.loadingStore.hide();
            }
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

        showError(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "error");
        },

        showSuccess(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "success");
        },
    },

};
</script>

<style scoped>
.parent {
    display: flex;
    flex-wrap: wrap;
}

.child {
    min-width: 270px;
    max-width: 500px;
    margin-left: 8px;
    margin-right: 8px;
}

/* .child:nth-last-child(1) {
    max-width: 500px;
} */
</style>