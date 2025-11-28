<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <v-btn @click="this.fetchHandOverDates" color="#0044d6" size="small" class="refresh" variant="flat" icon>
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <h2>
            <span class="to-hide">List of Hand-over Dates</span>
            <span class="to-show">Hand-over Dates</span>
        </h2>
        <div class="d-flex justify-end mt-3 mb-4">
            <v-btn color="green" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3" prepend-icon="mdi-download"
                @click="downloadHandOverDates">
                <span class="to-hide">XLS</span>
                <span class="to-show"></span>
            </v-btn>
        </div>
        <v-card>
            <v-card-text>
                <v-data-table :headers="headersTable" :items="mappedHandOverDatesData" :loading="loadingHandOverDates"
                    density="comfortable" height="200px">

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.category_label="{ item }">
                        <v-chip
                            :color="Number(item.category_id) === 1 ? 'orange' : Number(item.category_id) === 2 ? 'blue' : Number(item.category_id) === 3 ? 'green' : undefined"
                            size="small" variant="tonal">
                            {{ item.category_label }}
                        </v-chip>
                    </template>

                    <template v-slot:no-data>
                        <v-alert type="warning" variant="tonal" class="ma-4">
                            <span>&nbsp; No record found.</span>
                        </v-alert>
                    </template>

                </v-data-table>
            </v-card-text>
        </v-card>
    </v-container>
    <Alert ref="alertRef" />
</template>

<script>
import { computed } from 'vue';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useBenefOptionStore } from '@/stores/benefOptionStore';
import { useLoadingStore } from '@/stores/loading';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'HandOvers',

    components: {
        Alert,
    },

    data() {
        return {
            selectedRow: null,
            loadingHandOverDates: false,
            handOverDatesData: [],
            headersTable: [
                { title: 'Designated_To', value: 'designated_barangay', width: '20%' },
                { title: 'Benefeciaries', value: 'category_label', width: '20%' },
                { title: 'Venue', value: 'venue', width: '20%' },
                { title: 'Date_of_HandOver', value: 'hand_over_date', width: '20%' },
                { title: 'Last_Update', value: 'updated_at', width: '20%' },
            ],
            handOverdate: '',
            evidence_image_file: null,
            idImgSrc: null,
        }
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
        const benefOption = useBenefOptionStore();
        return {
            benefeciaryStore,
            loadingStore,
            formatCurrentDate,
            benefOption,
            barangayOption: computed(() => benefOption.barangayOption),
            benefCategoryOption: computed(() => benefOption.benefCategoryOption),
            handOverStatusOption: computed(() => benefOption.handOverStatusOption),
        };
    },

    beforeUnmount() {
        if (this.idImgSrc) {
            URL.revokeObjectURL(this.idImgSrc);
        }
    },

    mounted() {
        this.fetchHandOverDates();
    },

    computed: {
        mappedHandOverDatesData() {
            return this.handOverDatesData
        },
    },

    methods: {

        async fetchHandOverDates() {
            this.loadingHandOverDates = true;
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchHandOverDatesStore();
                this.handOverDatesData = this.benefeciaryStore.allHandOverDates;
                if (this.handOverDatesData && this.handOverDatesData.length > 0) {
                    this.handOverDatesData = this.handOverDatesData.map(order => this.formatHandOverData(order));
                }
                this.loadingHandOverDates = false;
            } catch (error) {
                console.error(error);
                this.showError(error);
            } finally {
                this.loadingHandOverDates = false;
                this.loadingStore.hide();
            }
        },

        async downloadHandOverDates() {
            await this.benefeciaryStore.fetchHandOverDatesStore(this.branchId);
            if (this.benefeciaryStore.allHandOverDates.length === 0) {
                this.showError("No hand-over data available to download.");
                return;
            } else {
                this.loadingStore.show('Downloading hand-over data...');
            }
            const allHandOverDates = this.benefeciaryStore.allHandOverDates.map(data => ({
                'Date of Hand-over': this.formatDateDownload(data.hand_over_date),
                'Coordinator': data.coordinator,
                'Benefeciary': data.category_label,
                'Venue': data.venue,
                'Dedicated Barangay': 'Brgy. ' + data.barangay_name + ' ' + data.address_line2,
                'Type of Benefit': data.benefit_type,
                'Status': data.hand_over_status_label,
                'Last Update': this.formatDateDownload(data.updated_at),
            }));

            const headings = [
                `Name of company: DSWD`,
                `Location: Sagay City, Negros Island Region`,
                `Date: ${this.formatCurrentDate}`,
                `Prepared by : Admin`,
                '',
            ].join('\n');

            const csvContent = "data:text/csv;charset=utf-8,"
                + headings + "\n"
                + Object.keys(allHandOverDates[0]).join(",") + "\n"
                + allHandOverDates.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Hand-over_Report.csv`);
            document.body.appendChild(link); // Required for FF
            this.showSuccess("Hand-over report downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
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

        formatDateDownload(dateString) {
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
                month: 'numeric',
                day: 'numeric'
            });
        },

        showSuccess(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "success");
        },

        showError(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "error");
        },
    }
};
</script>

<style scoped>
.dialog-id h3,
.dialog-id h4,
.dialog-id h5,
.dialog-id h6 {
    color: #0c0c0c;
}

.btn-filter {
    display: flex;
    justify-content: space-between;
    padding-left: 10%;
}

.refresh {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 1;
}
</style>