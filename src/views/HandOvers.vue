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
        <div class="d-flex justify-space-around mt-3">
            <v-row>
                <v-col cols="12" lg="7" md="10" sm="10">
                    <div class="d-flex">
                        <v-text-field density="compact" v-model="searchDate" placeholder="e.g January 30, 2025"
                            variant="outlined" label="Search date">
                        </v-text-field>
                    </div>
                </v-col>
            </v-row>
            <div>
                <v-btn color="green" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3"
                    prepend-icon="mdi-download" @click="downloadHandOverDates">
                    <span class="to-hide">XLS</span>
                    <span class="to-show"></span>
                </v-btn>
                <v-btn @click="toNewHandOverSched" color="blue" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3"
                    prepend-icon="mdi-plus">
                    <span class="to-hide">Add Hand-over Schedule</span>
                    <span class="to-show"></span>
                </v-btn>
            </div>
        </div>
        <v-card>
            <v-card-text>
                <v-data-table :headers="headersTable" :items="mappedHandOverDatesData" :loading="loadingHandOverDates"
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
                                        size="small" icon="mdi-pencil-outline">
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="View List" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn @click="viewHandOverSchedule(item)" v-bind="props" color="blue" variant="tonal"
                                        size="small" icon="mdi-eye-outline">
                                    </v-btn>
                                </template>
                            </v-tooltip>
                            <v-tooltip text="Change status" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn @click="showUploadEvidenceDialog(item)" v-bind="props" color="blue"
                                        variant="tonal" size="small" icon="mdi-swap-horizontal"
                                        :class="{ 'd-none': item.hand_over_status_id === 2 }">
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
                <v-card-title>Hand-over Info</v-card-title>
                <v-card-text>
                    <v-form ref="handOverForm" @submit.prevent="showHandOverInfoDialog">
                        <v-row class="my-5">
                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.hand_over_date" label="Hand-Over date"
                                    :rules="[v => !!v || 'Required']" variant="outlined"
                                    @click="handOverdateDialog = true" />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.coordinator" label="Coordinator"
                                    :rules="[v => !!v || 'Required']" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedRow.category_id" label="Category"
                                    :items="benefCategoryOption" :rules="[v => !!v || 'Required']"
                                    item-title="category_label" item-value="category_id" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.venue" label="Venue"
                                    :rules="[v => !!v || 'Required']" variant="outlined"
                                    placeholder="e.g. Sagay City Gymnasium" />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedRow.address_line1" label="Designated Barangay"
                                    :items="barangayOption" :rules="[v => !!v || 'Required']"
                                    item-title="barangay_name" item-value="barangay_id" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.address_line2" label="Address Line 2"
                                    :rules="[v => !!v || 'Required']" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="6" md="6" sm="6" class="pb-0">
                                <v-text-field v-model="selectedRow.benefit_type" label="Type of benefit"
                                    :rules="[v => !!v || 'Required']" variant="outlined" />
                            </v-col>
                            
                        </v-row>
                        <v-btn color="green" variant="tonal" prepend-icon="mdi-check" :disabled="!isFormValid"
                            @click="showHandOverInfoDialog"
                            :class="{ 'd-none': selectedRow.hand_over_status_id === 2 }">Confirm
                        </v-btn>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Date Dialog -->
        <v-dialog v-model="handOverdateDialog" max-width="380px">
            <v-card>
                <v-card-title>
                    <span class="headline">Select handOverdate</span>
                </v-card-title>
                <v-card-text>
                    <v-date-picker v-model="selectedRow.hand_over_date" color="#005f5a" locale="en" scrollable>
                        <template #actions>
                            <v-btn text color="#005f5a" @click="handOverdateDialog = false">Close</v-btn>
                        </template>
                    </v-date-picker>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Dialog for Uploading Evidence for Hand-over -->
        <v-dialog v-model="uploadEvidenceDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Upload Evidence</span>
                </v-card-title>
                <v-card-text>
                    <v-file-input v-model="evidence_image_file" label="Select Image" variant="outlined"
                        density="compact" prepend-icon="" capture="environment" accept="image/*"
                        :rules="[v => !!v || 'Required']" @change="previewIdImage" chips>
                    </v-file-input>
                    <span class="mt-2">
                        <img v-if="idImgSrc" :src="idImgSrc" width="180" height="180"
                            style="border: 1px solid #ccc ;border-radius: 10px;" alt="Customer ID Evidence" />
                        <v-btn v-else class="bg-grey-lighten-1" width="180" height="180" disabled>
                            Image Goes Here
                        </v-btn>
                    </span>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="uploadEvidenceDialog = false">Close</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-check"
                        @click="uploadEvidence">Upload &
                        Continue
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Confirm Dialog for Hand-over Status -->
        <v-dialog v-model="handOverStatusDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center text-info">Are you sure this schedule is already done?</p>
                    <p class="text-center text-info">Once confirmed, this cannot be undone.</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="handOverStatusDialog = false">Not yet!</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-check"
                        @click="updateHandOverStatus">Confirm
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Confirm Dialog for Hand-over date Info Modification -->
        <v-dialog v-model="handOverInfoDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center">Do you want to save hand-over date info?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="closeHandOverInfoDialog">Check
                        again</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-content-save"
                        @click="updateHandOverInfo">Save
                    </v-btn>
                </v-card-actions>
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
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'HandOvers',

    components: {
        Alert,
    },

    data() {
        return {
            searchDate: '',
            selectedRow: null,
            loadingHandOverDates: false,
            dialogInfo: false,
            handOverdateDialog: false,
            handOverStatusDialog: false,
            handOverInfoDialog: false,
            uploadEvidenceDialog: false,
            handOverDatesData: [],
            headersTable: [
                { title: 'Designated_To', value: 'designated_barangay', width: '10%' },
                { title: 'Benefeciaries', value: 'category_label', width: '10%' },
                { title: 'Venue', value: 'venue', width: '20%' },
                { title: 'Date_of_HandOver', value: 'hand_over_date', width: '20%' },
                { title: 'Status', value: 'hand_over_status_label', width: '10%' },
                { title: 'Last_Update', value: 'updated_at', width: '20%' },
                { title: '', value: 'actions', sortable: false, width: '10%' }
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

    watch: {
        'selectedRow.hand_over_date': function (newVal) {
            if (newVal) {
                this.handOverDateDialog = false;
                this.selectedRow.hand_over_date = this.formatDateTime(newVal);
            }
        },
        evidence_image_file(newVal) {
            if (!newVal) {
                this.idImgSrc = null;
            }
        },
    },

    computed: {
        mappedHandOverDatesData() {
            if (!this.searchDate) {
                return this.handOverDatesData;
            }
            return this.handOverDatesData.filter(data =>
                data.hand_over_date.toLowerCase().includes(this.searchDate.toLowerCase())
            );
        },
        isFormValid() {
            return (
                this.selectedRow.hand_over_date &&
                this.selectedRow.coordinator &&
                this.selectedRow.venue &&
                this.selectedRow.address_line1 &&
                this.selectedRow.address_line2 &&
                this.selectedRow.benefit_type &&
                this.selectedRow.category_id

            );
        },
    },

    methods: {
        toNewHandOverSched() {
            this.$router.push('/new-hand-over-schedule');
        },

        // Read all hand-over dates
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

        showHandOverStatusDialog(item) {
            this.selectedRow = { ...item };
            this.handOverStatusDialog = true;
        },

        showHandOverInfoDialog() {
            if (this.isFormValid) this.handOverInfoDialog = true;
        },

        closeHandOverInfoDialog() {
            this.handOverInfoDialog = false;
        },

        viewDialogInfo(details) {
            this.benefOption.fetchHandOverOptions();
            this.benefOption.fetchBarangayOption();
            this.selectedRow = { ...details };
            this.dialogInfo = true;
            const barangays = this.barangayOption.find(c => c.barangayy_id === Number(details.barangayy_id));
            const category = this.benefCategoryOption.find(c => c.category_id === Number(details.category_id));
            return {
                barangay_name: barangays?.barangay_name,
                category_label: category?.category_label,
            };
        },

        viewHandOverSchedule(item) {
            this.$router.push({
                name: 'HandOverEvent',
                params: { handOverId: item.hand_over_id },
            });
        },

        showUploadEvidenceDialog(item) {
            this.selectedRow = { ...item };
            this.uploadEvidenceDialog = true;
        },

        async uploadEvidence() {
            if (!this.selectedRow?.hand_over_id) {
                this.showError("Invalid hand-over data!");
                return;
            }
            if (!this.evidence_image_file) {
                this.showError("Please select an evidence image!");
                return;
            }
            this.uploadEvidenceDialog = false;
            this.handOverStatusDialog = true;
        },

        previewIdImage() {
            if (this.evidence_image_file && this.evidence_image_file instanceof File) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.idImgSrc = e.target.result;
                };
                reader.readAsDataURL(this.evidence_image_file);
            } else {
                this.idImgSrc = null;
            }
        },

        async compressImage(file, targetSizeKB = 200) {
            const img = await new Promise((resolve) => {
                const image = new Image();
                image.onload = () => resolve(image);
                image.src = URL.createObjectURL(file);
            });
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            const maxWidth = 1024;
            const scale = Math.min(maxWidth / img.width, 1);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let quality = 0.9;
            let blob = await new Promise((resolve) =>
                canvas.toBlob(resolve, "image/jpeg", quality)
            );
            while (blob.size / 1024 > targetSizeKB && quality > 0.1) {
                quality -= 0.1;
                blob = await new Promise((resolve) =>
                    canvas.toBlob(resolve, "image/jpeg", quality)
                );
            }
            return new File([blob], file.name || "id_image.jpg", { type: "image/jpeg" });
        },

        // Update hand-over status
        async updateHandOverStatus() {
            this.handOverStatusDialog = false;
            if (!this.selectedRow?.hand_over_id) {
                this.showError("Invalid hand-over data!");
                return;
            }
            try {
                this.loadingStore.show("");
                const payload = new FormData();
                payload.append("hand_over_id", this.selectedRow.hand_over_id);
                payload.append("hand_over_status_id", 2);
                if (this.evidence_image_file) {
                    const IdImageFile = Array.isArray(this.evidence_image_file)
                        ? this.evidence_image_file[0]
                        : this.evidence_image_file;
                    const compressedFile = await this.compressImage(IdImageFile);
                    payload.append("evidence_image_file", compressedFile);
                }
                await this.benefeciaryStore.updateHandOverStatusStore(payload);

                const now = new Date();
                const formattedDate = now.toISOString();
                const handOverDataWithUpdatedAt = {
                    hand_over_id: this.selectedRow.hand_over_id,
                    hand_over_status_id: Number(this.selectedRow.hand_over_status_id),
                    updated_at: formattedDate,
                };
                const updatedHandOverData = this.formatHandOverStatus({ ...this.selectedRow, ...handOverDataWithUpdatedAt });
                const index = this.handOverDatesData.findIndex(
                    p => p.hand_over_id === this.selectedRow.hand_over_id
                );
                if (index !== -1) {
                    this.handOverDatesData.splice(index, 1, updatedHandOverData);
                }
                this.showSuccess("Image uploaded & hand-over status updated!");
                this.idImgSrc = null;
                this.evidence_image_file = null;
                this.fetchHandOverDates();
            } catch (error) {
                console.error(error);
                this.showError(error.message);
            } finally {
                this.loadingStore.hide();
            }
        },

        // Update hand-over info
        async updateHandOverInfo() {
            this.handOverInfoDialog = false;
            this.dialogInfo = false;
            this.loadingStore.show("");
            if (!this.$refs.handOverForm.validate()) return;
            if (!this.selectedRow || !this.selectedRow.hand_over_id) {
                this.showError("Invalid hand-over data!");
                return;
            }
            try {
                const now = new Date();
                const formattedDate = now.toISOString();
                const handOverData = {
                    hand_over_id: this.selectedRow.hand_over_id,
                    hand_over_date: this.selectedRow.hand_over_date?.trim(),
                    coordinator: this.selectedRow.coordinator?.trim(),
                    category_id: Number(this.selectedRow.category_id),
                    venue: this.selectedRow.venue?.trim(),
                    address_line1: Number(this.selectedRow.address_line1),
                    address_line2: this.selectedRow.address_line2?.trim(),
                    benefit_type: this.selectedRow.benefit_type?.trim(),
                    hand_over_status_id: Number(this.selectedRow.hand_over_status_id),
                };
                const handOverDataWithUpdatedAt = {
                    hand_over_id: this.selectedRow.hand_over_id,
                    hand_over_date: this.selectedRow.hand_over_date?.trim(),
                    coordinator: this.selectedRow.coordinator?.trim(),
                    category_id: Number(this.selectedRow.category_id),
                    venue: this.selectedRow.venue?.trim(),
                    address_line1: Number(this.selectedRow.address_line1),
                    address_line2: this.selectedRow.address_line2?.trim(),
                    benefit_type: this.selectedRow.benefit_type?.trim(),
                    hand_over_status_id: Number(this.selectedRow.hand_over_status_id),
                    updated_at: formattedDate,
                };
                await this.benefeciaryStore.updateHandOverInfoStore(handOverData);
                console.log("Updated hand-over data:", handOverData);
                const updatedHandOverData = this.formatHandOverData({ ...this.selectedRow, ...handOverDataWithUpdatedAt });
                const index = this.handOverDatesData.findIndex(
                    p => p.hand_over_id === this.selectedRow.hand_over_id
                );
                if (index !== -1) {
                    this.handOverDatesData.splice(index, 1, updatedHandOverData);
                }
                this.loadingStore.hide();
                this.showSuccess("Hand-over info successfully updated!");
            } catch (error) {
                console.error(error);
                this.showError(error);
            } finally {
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
            this.showSuccess("Hand-over downloaded successfully!");
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

        formatHandOverStatus(data) {
            return {
                ...data,
                updated_at: data.updated_at ? this.formatDateTime(data.updated_at) : 'N/A',
                hand_over_status_id: this.handOverStatusOption.find(
                    status => status.hand_over_status_id === data.hand_over_status_id
                )?.hand_over_status_id || 'N/A',

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

        formathandOverdate(dateString) {
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