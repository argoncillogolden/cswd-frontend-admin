<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <v-btn @click="this.fetchHandOverDateEvent(this.handOverIdProp)" color="#0044d6" size="small" class="refresh" variant="flat" icon>
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <h2>
            <span class="to-hide">List of Benefeciaries for Hand-over</span>
            <span class="to-show">Benefeciaries for Hand-over</span>
        </h2>
        <v-icon @click="back" class="my-5" title="Back">mdi-arrow-left</v-icon>

        <div class="d-flex flex-column">
            <h5 class="text-grey mb-1">Hand-over Date: 
                <span class="text-info">{{ this.dateOfHandOver }}</span>
            </h5>
            <h5 class="text-grey mb-1">Coordinated by: 
                <span class="text-info">{{ this.coordinatedPersonnel }}</span>
            </h5>
            <h5 class="text-grey mb-1">Designated barangay: 
                <span class="text-info">{{ this.designatedBrgy }}</span>
            </h5>
            <h5 class="text-grey mb-1">Venue: 
                <span class="text-info">{{ this.designatedVenue }}</span>
            </h5>
            <h5 class="text-grey mb-1">Type of benefit: 
                <span class="text-info">{{ this.benefitType }}</span>
            </h5>
            <h5 class="text-grey mb-1">Beneficiaries: 
                <span class="text-info">
                    <v-chip color="blue" size="small" variant="tonal">
                        {{ this.designatedBeneficiaries }}
                    </v-chip>
                </span>
            </h5>
        </div>

        <div class="d-flex justify-space-around mt-5">
            <v-row>
                <v-col cols="12" lg="7" md="10" sm="10">
                    <div class="d-flex">
                        <v-text-field density="compact" v-model="searchName" placeholder="e.g Juan Dela Cruz"
                            variant="outlined" label="Search name">
                        </v-text-field>
                    </div>
                </v-col>
            </v-row>
            <div>
                <v-btn color="green" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3"
                    prepend-icon="mdi-download" @click="downloadHandOverDates(this.handOverIdProp)">
                    <span class="to-hide">XLS</span>
                    <span class="to-show"></span>
                </v-btn>
            </div>
        </div>
        <v-card>
            <v-card-text>
                <v-data-table :headers="headersTable" :items="mappedHandOverBenefData" :loading="loadingHandOverBenef"
                    density="comfortable" height="400px">

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.category_label="{ item }">
                        <v-chip
                            :color="Number(item.category_id) === 1 ? 'orange' : Number(item.category_id) === 2 ? 'blue' : Number(item.category_id) === 3 ? 'green' : undefined"
                            size="small" variant="tonal">
                            {{ item.category_label }}
                        </v-chip>
                    </template>

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.hand_over_status_label="{ item }">
                        <v-chip
                            :color="Number(item.hand_over_status_id) === 1 ? 'red' : Number(item.hand_over_status_id) === 2 ? 'grey' : undefined"
                            size="small" variant="tonal">
                            {{ item.hand_over_status_label }}
                        </v-chip>
                    </template>

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">
                        <div class="d-flex" style="gap: 8px;">
                            <v-tooltip text="Edit info" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn @click="viewDialogInfo(item)" v-bind="props" color="blue" variant="tonal"
                                        size="small" icon="mdi-eye-outline">
                                    </v-btn>
                                </template>
                            </v-tooltip>
                        </div>
                    </template>

                    <template v-slot:no-data>
                        <v-alert type="warning" variant="tonal" class="ma-4">
                            <span>&nbsp; No record found.</span>
                        </v-alert>
                    </template>

                </v-data-table>
            </v-card-text>
        </v-card>

        <!-- Hand-over Info -->
        <v-dialog v-model="dialogInfo" width="800">
            <v-btn @click="dialogInfo = false" color="#0044d6" class="position-absolute" size="small"
                style="top: -17px; right: -17px; z-index: 10;" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card class="mb-5">
                <v-card-title>Hand-over Beneficiary Info</v-card-title>
                <v-card-text>
                        <v-row class="my-5">
                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.first_name" label="First name"
                                    variant="outlined" readonly />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.middle_name" label="Middle name"
                                    variant="outlined" readonly />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.last_name" label="Last name"
                                    variant="outlined" readonly />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.suffix" label="Suffix"
                                    variant="outlined" readonly />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.benef_age" label="Age"
                                    variant="outlined" readonly />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.gender_label" label="Gender"
                                    variant="outlined" readonly />
                            </v-col>

                        </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

    </v-container>
    <Alert ref="alertRef" />
</template>

<script>
import { computed } from 'vue';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useBenefOptionStore } from '@/stores/benefOptionStore';
import { useLoadingStore } from '@/stores/loading';
import echo from '@/resources/js/echo';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'HandOverEvent',

    components: {
        Alert,
    },

    data() {
        return {
            handOverIdProp: '',
            searchName: '',
            dateOfHandOver: '',
            coordinatedPersonnel: '',
            designatedVenue: '',
            benefitType: '',
            designatedBrgy: '',
            designatedBeneficiaries: '',
            selectedRow: null,
            loadingHandOverBenef: false,
            dialogInfo: false,
            handOverInfoDialog: false,
            handOverBenefData: [],
            handOverHeaderData: [],
            headersTable: [
                { title: 'Benefeciary name', value: 'display_beneficiary', width: '25%' },
                { title: 'Age', value: 'benef_age', width: '15%' },
                { title: 'Gender', value: 'gender_label', width: '20%' },
                { title: 'Status', value: 'hand_over_status_label', width: '20%' },
                { title: 'Last_update', value: 'updated_at', width: '20%' },
                { title: '', value: 'actions', sortable: false, width: '5%' }
            ],
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
            benefCategoryOption: computed(() => benefOption.benefCategoryOption),
            handOverStatusOption: computed(() => benefOption.handOverStatusOption),
        };
    },

    beforeMount() {
        echo.leave('received-cash-channel');
    },

    mounted() {
        const handOverId = this.$route.params.handOverId;
        if (handOverId) {
            this.handOverIdProp = Number(handOverId);
            this.fetchHandOverDateEvent(Number(handOverId));
        }
        this.updateFromBeneficiary();
    },

    computed: {
        mappedHandOverBenefData() {
            if (!this.searchName) {
                return this.handOverBenefData;
            }
            return this.handOverBenefData.filter(data =>
                data.last_name.toLowerCase().includes(this.searchName.toLowerCase()) ||
                data.first_name.toLowerCase().includes(this.searchName.toLowerCase()) ||
                data.middle_name.toLowerCase().includes(this.searchName.toLowerCase()) ||
                data.suffix.toLowerCase().includes(this.searchName.toLowerCase())
            );
        },
    },

    methods: {
        back() {
            this.$router.go(-1);
        },

        // Read all beneficiary for hand-over
        async fetchHandOverDateEvent(handOverId) {
            this.loadingHandOverBenef = true;
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchHandOverDateEventStore(handOverId);
                this.handOverBenefData = this.benefeciaryStore.handOverDateEvent;
                if (this.handOverBenefData && this.handOverBenefData.length > 0) {
                    this.handOverBenefData = this.handOverBenefData.map(order => this.formatBenefeciries(order));
                    
                    this.handOverHeaderData = this.benefeciaryStore.handOverDataHeaderEvent;
                    this.dateOfHandOver = this.handOverHeaderData.hand_over_date;
                    this.coordinatedPersonnel = this.handOverHeaderData.coordinator;
                    this.designatedVenue = this.handOverHeaderData.venue;
                    this.benefitType = this.handOverHeaderData.benefit_type;
                    this.designatedBrgy = `Brgy. ${this.handOverHeaderData.barangay_name}`.trim();
                    this.designatedBeneficiaries = this.handOverHeaderData.category_label;

                } else {
                    this.showError("No hand-over benefciary data found!");
                }
                this.loadingHandOverBenef = false;
            } catch (error) {
                console.error(error);
                this.showError(error);
            } finally {
                this.loadingHandOverBenef = false;
                this.loadingStore.hide();
            }
        },

        viewDialogInfo(details) {
            this.selectedRow = { ...details };
            this.dialogInfo = true;
            const category = this.benefCategoryOption.find(c => c.category_id === Number(details.category_id));
            return {
                category_label: category?.category_label,
            };
        },

        async downloadHandOverDates(handOverId) {
            await this.benefeciaryStore.fetchHandOverDateEventStore(handOverId);
            if (this.benefeciaryStore.handOverDateEvent.length === 0) {
                this.showError("No hand-over data available to download.");
                return;
            } else {
                this.loadingStore.show('Downloading hand-over data...');
            }
            const handOverDateEvent = this.benefeciaryStore.handOverDateEvent.map(data => ({
                'Beneficiary Name': `${data.last_name} ${data.first_name} ${data.middle_name} ${data.suffix}`.trim(),
                'Age': data.benef_age,
                'Gender': data.gender_label,
                'Status': data.hand_over_status_label,
                'Last Update': this.formatUpdateInDownload(data.updated_at),
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
                + Object.keys(handOverDateEvent[0]).join(",") + "\n"
                + handOverDateEvent.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Benefeciary_Hand-over_Report.csv`);
            document.body.appendChild(link); // Required for FF
            this.showSuccess("Beneficiary hand-over downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
        },

        updateFromBeneficiary() {
            echo.channel('received-cash-channel')
                .listen('CashReceived', (e) => {
                console.log(e);
                this.showSuccess('Confirmed cash received from ' + e.beneficiaryName);
                const handOverId = this.$route.params.handOverId;
                this.fetchHandOverDateEvent(Number(handOverId));
            });
        },

        formatBenefeciries(data) {
            if (data.suffix === null) {
                data.suffix = '';
            }
            return {
                ...data,
                updated_at: data.updated_at ? this.formatDateTime(data.updated_at) : 'N/A',
                designated_barangay: `${data.address_line1}, ${data.address_line2}`.trim(),
                display_beneficiary: `${data.last_name}, 
                    ${data.first_name} 
                    ${data.middle_name} 
                    ${data.suffix}`.trim(),
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

        formatUpdateInDownload(dateString) {
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