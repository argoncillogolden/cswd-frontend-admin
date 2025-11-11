<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <v-btn @click="this.fetchAllBenef" color="#0044d6" size="small" class="refresh" variant="flat" icon>
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <h2>
            <span class="to-hide">List of Benefeciaries</span>
            <span class="to-show">List</span>
        </h2>
        <div class="d-flex justify-space-around mt-3">
            <v-row>
                <v-col cols="12" lg="7" md="10" sm="10">
                    <div class="d-flex">
                        <v-text-field density="compact" 
                            v-model="searchBox"
                            variant="outlined" 
                            label="Search here...">
                        </v-text-field>
                        <v-autocomplete density="compact" 
                            v-model="selectedBarangay" 
                            variant="outlined"
                            class="ms-2"
                            :items="barangayOption"
                            item-value="barangay_id" 
                            item-title="barangay_name" 
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
                <v-btn @click="toNewBenef" color="blue" variant="tonal" size="small" class="ms-2 pb-7 ps-5 pa-3"
                    prepend-icon="mdi-plus">
                    <span class="to-hide">Add Benefeciary</span>
                    <span class="to-show"></span>
                </v-btn>
            </div>
        </div>
        <v-card>
            <v-card-text>
                <v-data-table :headers="headersBenef" :items="allBenef" :loading="loadingAllBenef" density="comfortable"
                    height="400px">

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

                    <!--eslint-disable-next-line -->
                    <template v-slot:item.actions="{ item }">
                        <div class="d-flex" style="gap: 8px;">
                            <v-tooltip text="Edit Info" location="top">
                                <template v-slot:activator="{ props }">
                                    <v-btn @click="editInfoDialog(item)" v-bind="props" color="blue" variant="tonal"
                                        size="small" icon="mdi-pencil-outline"></v-btn>
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

        <!-- Benefeciary Info -->
        <v-dialog v-model="dialogInfo" width="1000">
            <v-btn @click="dialogInfo = false" color="#0044d6" class="position-absolute" size="small"
                style="top: -17px; right: -17px; z-index: 10;" icon>
                <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-card class="mb-5">
                <v-card-title>Beneficiary Information</v-card-title>
                <v-card-text>
                    <v-form ref="benefeciaryForm" @submit.prevent="showConfirmDialog">
                        <img v-if="imgBenefSrc" :src="imgBenefSrc" style="width: 200px; height: 200px; border-radius: 10px;"
                            alt="Benefeciary Image" class="mt-5">
                        <v-skeleton-loader v-else type="image" style="width: 200px; height: 200px;" 
                            class="mt-5 bg-grey-darken-2"></v-skeleton-loader>
                        <v-row class="mt-3">
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.first_name" label="First name"
                                    :rules="[v => !!v || 'Required']" density="compact" variant="outlined"
                                    placeholder="e.g. Jose" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.middle_name" label="Middle name"
                                    :rules="[v => !!v || 'Required']" density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.last_name" label="Last name"
                                    :rules="[v => !!v || 'Required']" density="compact" variant="outlined"
                                    placeholder="e.g. Rizal" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.suffix" label="Suffix" density="compact"
                                    variant="outlined" placeholder="e.g. II, III, IV, V, Sr., Jr." />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.gender_id" label="Gender"
                                    :items="benefGenderOption" :rules="[v => !!v || 'Required']"
                                    item-title="gender_label" item-value="gender_id" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.bloodtype_id" label="Blood type"
                                    :items="benefBloodTypeOption" :rules="[v => !!v || 'Required']"
                                    item-title="bloodtype_label" item-value="bloodtype_id" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.birthdate" label="Birthdate"
                                    :rules="[v => !!v || 'Required']" density="compact" variant="outlined"
                                    @click="birthdateDialog = true" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.benef_age" label="Age (auto-calculated)"
                                    density="compact" variant="outlined" readonly />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.contact_number" label="Contact number"
                                    :rules="[v => !isNaN(parseFloat(v)) || 'Required' || 'Must be a valid number']"
                                    @input="e => selectedBenef.contact_number = e.target.value.replace(/[^0-9.]/g, '')"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.address_line1" label="Address Line 1"
                                    :rules="[v => !!v || 'Required']" density="compact" variant="outlined"
                                    placeholder="e.g. Purok Paghidaet" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.address_line2" label="Address Line 2"
                                    :items="barangayOption" :rules="[v => !!v || 'Required']" item-title="barangay_name"
                                    item-value="barangay_id" density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.address_line3" label="Address Line 3"
                                    :rules="[v => !!v || 'Required']" density="compact" variant="outlined"
                                    placeholder="e.g. Sagay City" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.category_id" label="Category"
                                    :items="benefCategoryOption" :rules="[v => !!v || 'Required']"
                                    item-title="category_label" item-value="category_id" density="compact"
                                    variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.email" :rules="[v => !!v || 'Required']" 
                                    label="Email" density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-autocomplete v-model="selectedBenef.benef_status_id" label="Status"
                                    :items="benefStatusOption" :rules="[v => !!v || 'Required']"
                                    item-title="benef_status_label" item-value="benef_status_id" density="compact"
                                    variant="outlined" />
                            </v-col>
                        </v-row>

                        <v-row class="mt-3">
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.benef_auth_person_first_name"
                                    label="Authorize person first name" :rules="[v => !!v || 'Required']"
                                    density="compact" variant="outlined" placeholder="e.g. Jose" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.benef_auth_person_middle_name"
                                    label="Authorize person middle name" :rules="[v => !!v || 'Required']"
                                    density="compact" variant="outlined" />
                            </v-col>

                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <v-text-field v-model="selectedBenef.benef_auth_person_last_name"
                                    label="Authorize person last name" :rules="[v => !!v || 'Required']"
                                    density="compact" variant="outlined" placeholder="e.g. Rizal" />
                            </v-col>
                            <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                                <img v-if="imgAuthPersonSrc" :src="imgAuthPersonSrc" 
                                    style="width: 200px; height: 200px; border-radius: 10px;"
                                    alt="Benefeciary Authorize Person Image">
                                <v-skeleton-loader v-else type="image" style="width: 200px; height: 200px;" 
                                    class="mt-5 bg-grey-darken-2" ></v-skeleton-loader>
                            </v-col>
                        </v-row>
                        <div class="mt-3 d-flex justify-end">
                            <v-btn color="green" variant="tonal" prepend-icon="mdi-check"
                                :disabled="!isFormValid" @click="showConfirmDialog">Confirm
                            </v-btn>
                        </div>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Date Dialog -->
        <v-dialog v-model="birthdateDialog" max-width="380px">
            <v-card>
                <v-card-title>
                    <span class="headline">Select birthdate</span>
                </v-card-title>
                <v-card-text>
                    <v-date-picker v-model="selectedBenef.birthdate" color="#005f5a" locale="en"
                        :max="new Date().toISOString().substr(0, 10)" scrollable>
                        <template #actions>
                            <v-btn text color="#005f5a" @click="birthdateDialog = false">Close</v-btn>
                        </template>
                    </v-date-picker>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Confirm Dialog for Benefeciary Info Modification -->
        <v-dialog v-model="confirmDialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Confirmation</span>
                </v-card-title>
                <v-card-text>
                    <p class="text-center">Do you want to save benefeciary info?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-content-save"
                        @click="confirmUpdateBenef">Save
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
    name: 'AllBenefeciaries',

    components: {
        Alert,
    },

    data() {
        return {
            filterDialog: false,
            searchBox: '',
            selectedBarangay: null,
            selectedBenef: null,
            loadingAllBenef: false,
            dialogInfo: false,
            birthdateDialog: false,
            confirmDialog: false,
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
            referenceNumber: "",
            benefSuffix: '',
            birthdate: '',
            imgBenefSrc: null,
            imgAuthPersonSrc: null,
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

    beforeUnmount() {
        if (this.imgBenefSrc) {
            URL.revokeObjectURL(this.imgBenefSrc);
        }
        if ( this.imgAuthPersonSrc) {
            URL.revokeObjectURL(this.imgAuthPersonSrc);
        }
    },

    mounted() {
        this.fetchAllBenef();
        this.benefOption.fetchBarangayOption();
    },

    watch: {
        'selectedBenef.birthdate': function (newVal) {
            if (newVal && this.selectedBenef) {
                this.birthdateDialog = false;
                this.selectedBenef.birthdate = this.formatBirthdate(newVal);
                let birthDateObj = null;
                if (typeof newVal === 'string' && /^[A-Za-z]+ \d{1,2}, \d{4}$/.test(newVal)) {
                    birthDateObj = new Date(newVal);
                } else if (typeof newVal === 'string' && newVal.match(/^\d{4}-\d{2}-\d{2}$/)) {
                    birthDateObj = new Date(newVal + 'T00:00:00');
                }
                if (birthDateObj && !isNaN(birthDateObj)) {
                    const today = new Date();
                    let age = today.getFullYear() - birthDateObj.getFullYear();
                    const m = today.getMonth() - birthDateObj.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
                        age--;
                    }
                    this.selectedBenef.benef_age = age;
                } else {
                    this.selectedBenef.benef_age = '';
                }
            }
        },
        referenceNumber: {
            immediate: true,
            handler(newVal) {
                if (newVal) {
                    this.fetchImageID(newVal);
                    this.fetchAuthPersonImageID(newVal);
                }
            }
        },
    },

    computed: {
        allBenef() {
            let items = Array.isArray(this.benefeciaries) ? this.benefeciaries.slice() : [];
            if (this.selectedBarangay && this.selectedBarangay !== '') {
                if (!isNaN(Number(this.selectedBarangay))) {
                    items = items.filter(b => Number(b.address_line2) === Number(this.selectedBarangay));
                }
            }
            if (!this.searchBox) return items;
            const q = this.searchBox.toLowerCase();
            return items.filter(benef =>
                (benef.category_label || '').toLowerCase().includes(q) ||
                (benef.barangay_name || '').toLowerCase().includes(q) ||
                (benef.first_name || '').toLowerCase().includes(q) ||
                (benef.middle_name || '').toLowerCase().includes(q) ||
                (benef.last_name || '').toLowerCase().includes(q) ||
                (benef.gender_label || '').toLowerCase().includes(q) ||
                (benef.benef_status_label || '').toLowerCase().includes(q)
            );
        },
        isFormValid() {
            return (
                this.selectedBenef.first_name &&
                this.selectedBenef.middle_name &&
                this.selectedBenef.last_name &&
                this.selectedBenef.birthdate &&
                this.selectedBenef.benef_age &&
                this.selectedBenef.address_line1 &&
                this.selectedBenef.address_line2 &&
                this.selectedBenef.address_line3 &&
                this.selectedBenef.contact_number &&
                this.selectedBenef.gender_id &&
                this.selectedBenef.bloodtype_id &&
                this.selectedBenef.category_id &&
                this.selectedBenef.email &&
                this.selectedBenef.benef_status_id &&
                this.selectedBenef.benef_auth_person_first_name &&
                this.selectedBenef.benef_auth_person_middle_name &&
                this.selectedBenef.benef_auth_person_last_name
            );
        },
    },

    methods: {

        toNewBenef() {
            this.$router.push('/new-benefeciary');
        },

        showFilterDialog() {
            this.filterDialog = true;
        },

        // Read all benefeciary
        async fetchAllBenef() {
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

        filterByBarangay() {
            this.filterDialog = false;
        },

        editInfoDialog(details) {
            this.benefOption.fetchAllOptions();
            this.benefOption.fetchBarangayOption();
            this.selectedBenef = { ...details };
            this.dialogInfo = true;
            if (this.selectedBenef && this.selectedBenef.reference_number) {
                this.fetchImageID(this.selectedBenef.reference_number);
                this.fetchAuthPersonImageID(this.selectedBenef.reference_number);
            } else {
                this.imgBenefSrc = null;
                this.imgAuthPersonSrc = null;
            }
            const barangay = this.barangayOption.find(br => br.barangay_id === Number(details.barangay_id));
            const gender = this.benefGenderOption.find(g => g.gender_id === Number(details.gender_id));
            const bloodtype = this.benefBloodTypeOption.find(b => b.bloodtype_id === Number(details.bloodtype_id));
            const category = this.benefCategoryOption.find(c => c.category_id === Number(details.category_id));
            const benefStatus = this.benefStatusOption.find(c => c.benef_status_id === Number(details.benef_status_id));
            return {
                barangay_name: barangay?.barangay_name,
                gender_label: gender?.gender_label,
                bloodtype_label: bloodtype?.bloodtype_label,
                category_label: category?.category_label,
                benef_status_label: benefStatus?.benef_status_label,
            };
        },
        

        async fetchImageID(referenceNumber) {
            try {
                const imageBlob = await this.benefeciaryStore.fetchImageIDStore(referenceNumber);
                this.imgBenefSrc = URL.createObjectURL(imageBlob);
                if (!this.imgBenefSrc) {
                    console.error('Failed to create image URL from blob');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                this.imgBenefSrc = '';
            }
        },

        async fetchAuthPersonImageID(referenceNumber) {
            try {
                const qrCodeBlob = await this.benefeciaryStore.fetchAuthPersonImageIDStore(referenceNumber);
                this.imgAuthPersonSrc = URL.createObjectURL(qrCodeBlob);
                if (!this.imgAuthPersonSrc) {
                    console.error('Failed to create image URL from blob');
                }
            } catch (error) {
                console.error('Error authorize person id:', error);
                this.imgAuthPersonSrc = '';
            }
        },
        // Update benefeciary
        async confirmUpdateBenef() {
            this.confirmDialog = false;
            this.dialogInfo = false;
            this.loadingStore.show("");
            if (!this.$refs.benefeciaryForm.validate()) return;
            if (!this.selectedBenef || !this.selectedBenef.beneficiary_id) {
                this.showError("Invalid benefeciary data!");
                return;
            }
            try {
                const now = new Date();
                const formattedDate = now.toISOString();
                const benefData = {
                    beneficiary_id: this.selectedBenef.beneficiary_id,
                    first_name: this.selectedBenef.first_name?.trim(),
                    middle_name: this.selectedBenef.middle_name?.trim(),
                    last_name: this.selectedBenef.last_name?.trim(),
                    birthdate: this.selectedBenef.birthdate?.trim(),
                    benef_age: Number(this.selectedBenef.benef_age),
                    address_line1: this.selectedBenef.address_line1?.trim(),
                    address_line2: Number(this.selectedBenef.address_line2),
                    address_line3: this.selectedBenef.address_line3?.trim(),
                    contact_number: this.selectedBenef.contact_number?.trim(),
                    suffix: this.selectedBenef.suffix?.trim(),
                    gender_id: Number(this.selectedBenef.gender_id),
                    bloodtype_id: Number(this.selectedBenef.bloodtype_id),
                    category_id: Number(this.selectedBenef.category_id),
                    email: this.selectedBenef.email?.trim(),
                    benef_status_id: Number(this.selectedBenef.benef_status_id),
                    benef_auth_person_first_name: this.selectedBenef.benef_auth_person_first_name?.trim(),
                    benef_auth_person_middle_name: this.selectedBenef.benef_auth_person_middle_name?.trim(),
                    benef_auth_person_last_name: this.selectedBenef.benef_auth_person_last_name?.trim(),
                };
                const benefDataWithUpdatedAt = {
                    beneficiary_id: this.selectedBenef.beneficiary_id,
                    first_name: this.selectedBenef.first_name?.trim(),
                    middle_name: this.selectedBenef.middle_name?.trim(),
                    last_name: this.selectedBenef.last_name?.trim(),
                    birthdate: this.selectedBenef.birthdate?.trim(),
                    benef_age: Number(this.selectedBenef.benef_age),
                    address_line1: this.selectedBenef.address_line1?.trim(),
                    address_line2: Number(this.selectedBenef.address_line2),
                    address_line3: this.selectedBenef.address_line3?.trim(),
                    contact_number: this.selectedBenef.contact_number?.trim(),
                    suffix: this.selectedBenef.suffix?.trim(),
                    gender_id: Number(this.selectedBenef.gender_id),
                    bloodtype_id: Number(this.selectedBenef.bloodtype_id),
                    category_id: Number(this.selectedBenef.category_id),
                    email: this.selectedBenef.email?.trim(),
                    benef_status_id: Number(this.selectedBenef.benef_status_id),
                    benef_auth_person_first_name: this.selectedBenef.benef_auth_person_first_name?.trim(),
                    benef_auth_person_middle_name: this.selectedBenef.benef_auth_person_middle_name?.trim(),
                    benef_auth_person_last_name: this.selectedBenef.benef_auth_person_last_name?.trim(),
                    updated_at: formattedDate,
                };
                await this.benefeciaryStore.updateBenefInfoStore(benefData);
                console.log("Updated benefeciary:", benefData);
                const updatedBenef = this.formatallBenef({ ...this.selectedBenef, ...benefDataWithUpdatedAt });
                const index = this.benefeciaries.findIndex(
                    p => p.beneficiary_id === this.selectedBenef.beneficiary_id
                );
                if (index !== -1) {
                    this.benefeciaries.splice(index, 1, updatedBenef);
                }
                this.showSuccess("Benefeciary info successfully updated!");
                this.fetchAllBenef();
            } catch (error) {
                console.error(error);
                this.showError(error);
            } finally {
                this.loadingStore.hide();
            }
        },

        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },

        closeConfirmDialog() {
            this.confirmDialog = false;
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