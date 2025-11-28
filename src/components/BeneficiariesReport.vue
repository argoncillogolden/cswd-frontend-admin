<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <v-btn @click="this.fetchAllBeneficiaries" color="#0044d6" size="small" class="refresh" variant="flat" icon>
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <h2>
            <span class="to-hide">List of Benefeciaries</span>
            <span class="to-show">List</span>
        </h2>
        <div class="d-flex justify-space-around mt-3">
            <v-row>
                <v-col cols="12" lg="6" md="6" sm="6">
                    <div class="d-flex">
                        <v-autocomplete density="compact" v-model="selectedBarangay" variant="outlined" class="ms-2"
                            :items="barangayOption" item-value="barangay_id" item-title="barangay_name"
                            label="Filter by barangay">
                        </v-autocomplete>
                    </div>
                </v-col>
            </v-row>
            <div>
                <v-btn @click="handleDownload" color="green" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3"
                    prepend-icon="mdi-download">
                    <span class="to-hide">XLS</span>
                    <span class="to-show"></span>
                </v-btn>
            </div>
        </div>
        <v-card>
            <v-card-text>
                <v-data-table :headers="headersBenef" :items="allBenef" :loading="loadingAllBenef" density="comfortable"
                    height="200px">

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.barangay_name="{ item }">
                        <span>Brgy. {{ item.barangay_name }}</span>
                    </template>

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.category_label="{ item }">
                        <v-chip
                            :color="Number(item.category_id) === 1 ? 'orange' : Number(item.category_id) === 2 ? 'blue' : undefined"
                            size="small" variant="tonal">
                            {{ item.category_label }}
                        </v-chip>
                    </template>

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.benef_status_id="{ item }">
                        <v-chip
                            :color="Number(item.benef_status_id) === 1 ? 'green' : Number(item.benef_status_id) === 2 ? 'blue' : Number(item.benef_status_id) === 3 ? 'red' : undefined"
                            size="small" variant="tonal">
                            {{ item.benef_status_label }}
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
    name: 'AllBenefeciaries',

    components: {
        Alert,
    },

    data() {
        return {
            selectedBarangay: null,
            loadingAllBenef: false,
            benefeciaries: [],
            headersBenef: [
                { title: 'Name_of_benefeciary', value: 'display_name', sortable: true, width: '20%' },
                { title: 'Age', value: 'benef_age', width: '5%' },
                { title: 'Gender', value: 'gender_label', width: '5%' },
                { title: 'Barangay', value: 'barangay_name', sortable: true, width: '20%' },
                { title: 'Category', value: 'category_label', width: '20%' },
                { title: 'Status', value: 'benef_status_id', width: '5%' },
                { title: 'Last_update', value: 'updated_at', sortable: true, width: '15%' },
                { title: '', value: 'actions', sortable: false, width: '5%' }
            ],
            benefSuffix: '',
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
            barangayOption: computed(() => [
                { barangay_id: '', barangay_name: 'ALL' },
                ...benefOption.barangayOption
            ]),
            benefGenderOption: computed(() => benefOption.benefGenderOption),
            benefBloodTypeOption: computed(() => benefOption.benefBloodTypeOption),
            benefCategoryOption: computed(() => benefOption.benefCategoryOption),
            benefStatusOption: computed(() => benefOption.benefStatusOption),
        };
    },

    mounted() {
        this.fetchAllBeneficiaries();
        this.benefOption.fetchBarangayOption();
    },

    computed: {
        allBenef() {
            let items = Array.isArray(this.benefeciaries) ? this.benefeciaries.slice() : [];
            if (this.selectedBarangay && this.selectedBarangay !== '') {
                if (!isNaN(Number(this.selectedBarangay))) {
                    items = items.filter(b => Number(b.address_line2) === Number(this.selectedBarangay));
                }
            }
            return items;
        },
    },

    methods: {

        async fetchAllBeneficiaries() {
            this.loadingAllBenef = true;
            this.loadingStore.show('');
            try {
                await this.benefeciaryStore.fetchAllBenefStore();
                this.benefeciaries = this.benefeciaryStore.allBenefeciaries;
                if (this.benefeciaries && this.benefeciaries.length > 0) {
                    this.benefeciaries = this.benefeciaries.map(order => this.formatallBenef(order));
                }
                this.loadingAllBenef = false;
            } catch (error) {
                console.error(error);
                this.showError(error);
            } finally {
                this.loadingAllBenef = false;
                this.loadingStore.hide();
            }
        },

        handleDownload() {
            if (this.selectedBarangay) {
                this.downloadFilteredBenefeciaries(this.selectedBarangay);
            } else {
                this.downloadBenefeciaries();
            }
        },

        async downloadFilteredBenefeciaries(filterBarangay) {
            await this.benefeciaryStore.fetchAllFilteredBenefStore(filterBarangay);
            if (this.benefeciaryStore.allBenefeciaries.length === 0) {
                this.showError("No benefeciary available to download.");
                return;
            } else {
                this.loadingStore.show('Downloading benefeciary...');
            }
            const allBenefeciaries = this.benefeciaryStore.allBenefeciaries.map(benef => ({
                'Benefeciary Name': benef.first_name + ' ' + benef.middle_name + ' ' + benef.last_name + ' ' + benef.suffix ?? '',
                'Birthdate': this.formatDateDownload(benef.birthdate),
                'Age': benef.benef_age,
                'Gender': benef.gender_label,
                'Address': benef.address_line1 + ' Barangay ' + benef.barangay_name + ' ' + benef.address_line3,
                'Contact': benef.contact_number,
                'Blood type': benef.bloodtype_label,
                'Category': benef.category_label,
                'Last Update': this.formatDateDownload(benef.updated_at),
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
                + Object.keys(allBenefeciaries[0]).join(",") + "\n"
                + allBenefeciaries.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Benefeciary_Report.csv`);
            document.body.appendChild(link);
            this.showSuccess("Beneficiary report downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
        },

        async downloadBenefeciaries() {
            await this.benefeciaryStore.fetchAllBenefStore();
            if (this.benefeciaryStore.allBenefeciaries.length === 0) {
                this.showError("No benefeciary available to download.");
                return;
            } else {
                this.loadingStore.show('Downloading benefeciary...');
            }
            const allBenefeciaries = this.benefeciaryStore.allBenefeciaries.map(benef => ({
                'Benefeciary Name': benef.first_name + ' ' + benef.middle_name + ' ' + benef.last_name + ' ' + benef.suffix ?? '',
                'Birthdate': this.formatDateDownload(benef.birthdate),
                'Age': benef.benef_age,
                'Gender': benef.gender_label,
                'Address': benef.address_line1 + ' Barangay ' + benef.barangay_name + ' ' + benef.address_line3,
                'Contact': benef.contact_number,
                'Blood type': benef.bloodtype_label,
                'Category': benef.category_label,
                'Last Update': this.formatDateDownload(benef.updated_at),
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
                + Object.keys(allBenefeciaries[0]).join(",") + "\n"
                + allBenefeciaries.map(e => Object.values(e).join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `Benefeciary_Report.csv`);
            document.body.appendChild(link);
            this.showSuccess("Beneficiary report downloaded successfully!");
            link.click();
            this.loadingStore.hide();
            document.body.removeChild(link);
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

        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'Asia/Manila'
            });
        },

        formatBirthdate(dateString) {
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