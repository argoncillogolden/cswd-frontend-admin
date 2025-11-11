<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <h2>Add New Benefeciary</h2>
        <v-icon @click="back" class="my-5" title="Back">mdi-arrow-left</v-icon>
        <v-form ref="benefeciaryForm" @submit.prevent="showConfirmDialog">

            <!-- Benefeciary Information -->
            <v-container>
                <h4 class="mb-3">Benefeciary Information</h4>
                <v-row>
                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="firstName" label="First name" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="Type here..." />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="middleName" label="Middle name" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="Type here..." />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="lastName" label="Last name" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="Type here..." />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="benefSuffix" label="Suffix (if applicable)" variant="outlined"
                            density="compact" placeholder="e.g. II, III, IV, V, Sr., Jr." />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-autocomplete v-model="benefGender" @click="getBenefGenderOption" label="Gender"
                            :items="benefGenderOption" :rules="[v => !!v || 'Required']" item-title="gender_label"
                            item-value="gender_id" variant="outlined" density="compact" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-autocomplete v-model="benefBloodType" @click="getBenefBloodTypeOption" label="Blood type"
                            :items="benefBloodTypeOption" :rules="[v => !!v || 'Required']" item-title="bloodtype_label"
                            item-value="bloodtype_id" variant="outlined" density="compact" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="birthDate" label="Birthdate" @click="birthdateDialog = true"
                            variant="outlined" density="compact" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="benefAge" label="Age (auto-calculated)" variant="outlined"
                            density="compact" readonly />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="contactNumber" label="Contact number"
                            :rules="[v => !isNaN(parseFloat(v)) || 'Required' || 'Must be a valid number']"
                            @input="e => contactNumber = e.target.value.replace(/[^0-9.]/g, '')" variant="outlined"
                            density="compact" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="addressLine1" label="Address Line 1" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="e.g. Purok Paghidaet" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-autocomplete v-model="addressLine2" @click="getBarangayOption" label="Address Line 2"
                            :items="barangayOption" :rules="[v => !!v || 'Required']" item-value="barangay_id"
                            item-title="barangay_name" variant="outlined" density="compact" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="addressLine3" label="Address Line 3" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="e.g. Sagay City" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="email" label="Email" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="e.g. example@email.com" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-autocomplete v-model="benefCategory" @click="getBenefCategoryOption" label="Category"
                            :items="benefCategoryOption" :rules="[v => !!v || 'Required']" item-title="category_label"
                            item-value="category_id" variant="outlined" density="compact" />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-file-input v-model="id_image_file" label="Attach ID" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" prepend-icon="" capture="environment" accept="image/*"
                            @change="previewIdImage" chips>
                        </v-file-input>
                    </v-col>

                    <span class="mt-2 ml-3">
                        <img v-if="idImgSrc" :src="idImgSrc" width="180" height="180"
                            style="border: 1px solid #ccc ;border-radius: 10px;" alt="Beneficiary ID" />
                        <v-btn v-else class="bg-grey-lighten-1" width="180" height="180" disabled>
                            ID Goes Here
                        </v-btn>
                    </span>
                </v-row>
            </v-container>


            <!-- Benefeciary Authorize Person -->
            <v-container>
                <h4 class="mb-3">Benefeciary  Authorize Person</h4>
                <v-row>
                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="benefAuthPersonFirstName" label="Authorize Person first name" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="Type here..." />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="benefAuthPersonMiddleName" label="Authorize Person middle name" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="Type here..." />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-text-field v-model="benefAuthPersonLastName" label="Authorize Person last name" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" placeholder="Type here..." />
                    </v-col>

                    <v-col cols="12" lg="4" md="4" sm="6" class="pb-0">
                        <v-file-input v-model="benef_auth_image_file" label="Attach ID" :rules="[v => !!v || 'Required']"
                            variant="outlined" density="compact" prepend-icon="" capture="environment" accept="image/*"
                            @change="previewBenefAuthIdImage" chips>
                        </v-file-input>
                    </v-col>

                    <span class="mt-2">
                        <img v-if="idImgBenefAuthSrc" :src="idImgBenefAuthSrc" width="180" height="180"
                            style="border: 1px solid #ccc ;border-radius: 10px;" alt="Authorize Person ID" />
                        <v-btn v-else class="bg-grey-lighten-1" width="180" height="180" disabled>
                            ID Goes Here
                        </v-btn>
                    </span>
                </v-row>
            </v-container>
            
            <!-- Confirm -->
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-btn color="green" variant="tonal" prepend-icon="mdi-check"
                            :disabled="!isFormValid || validatingBenefeciary" @click="showConfirmDialog">
                            Confirm
                        </v-btn>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>

        <!-- Date Dialog -->
        <v-dialog v-model="birthdateDialog" max-width="380px">
            <v-card>
                <v-card-title>
                    <span class="headline">Select birthdate</span>
                </v-card-title>
                <v-card-text>
                    <v-date-picker v-model="birthDate" color="#005f5a" locale="en"
                        :max="new Date().toISOString().substr(0, 10)" scrollable>
                        <template #actions>
                            <v-btn text color="#005f5a" @click="birthdateDialog = false">Close</v-btn>
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
                    <p class="text-center">Do you want to save new benefeciary?</p>
                </v-card-text>
                <v-card-actions class="mx-4 my-4">
                    <v-spacer></v-spacer>
                    <v-btn color="red" variant="tonal" class="px-3" prepend-icon="mdi-close"
                        @click="closeConfirmDialog">Check
                        again</v-btn>
                    <v-btn color="green" variant="tonal" class="px-3" prepend-icon="mdi-content-save"
                        @click="submitForm">Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <Alert ref="alertRef" />
    </v-container>
</template>

<script>
import apiClient from '../axios';
import Alert from '@/components/Alert.vue';
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';
import { useLoadingStore } from '@/stores/loading';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'NewBenefeciary',
    components: {
        Alert,
    },
    data() {
        return {
            referenceNumber: '',
            validatingBenefeciary: false,
            confirmDialog: false,
            firstName: '',
            middleName: '',
            lastName: '',
            birthDate: '',
            birthdateDialog: false,
            benefAge: null,
            addressLine1: '',
            addressLine2: null,
            addressLine3: 'Sagay City',
            contactNumber: '',
            benefSuffix: '',
            benefGender: null,
            benefBloodType: null,
            benefCategory: null,
            barangayOption: [],
            benefGenderOption: [],
            benefBloodTypeOption: [],
            benefCategoryOption: [],
            benefAuthPersonFirstName: '',
            benefAuthPersonMiddleName: '',
            benefAuthPersonLastName: '',
            id_image_file: null,
            idImgSrc: null,
            benef_auth_image_file: null,
            idImgBenefAuthSrc: null,
            email: '',
            password: '',
        };
    },

    setup() {
        const benefeciaryStore = useBenefeciaryStore();
        const loadingStore = useLoadingStore();
        return { benefeciaryStore, loadingStore };
    },

    beforeUnmount() {
        if (this.idImgSrc) {
            URL.revokeObjectURL(this.idImgSrc);
        }
        if (this.idImgBenefAuthSrc) {
            URL.revokeObjectURL(this.idImgBenefAuthSrc);
        }
    },

    watch: {
        birthDate(newVal) {
            if (newVal) {
                this.birthdateDialog = false;
                this.birthDate = this.formatDateTime(newVal);
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
                    this.benefAge = age;
                } else {
                    this.benefAge = '';
                }
            } else {
                this.benefAge = '';
            }
        },
        id_image_file(newVal) {
            if (!newVal) {
                this.idImgSrc = null;
            }
        },
        benef_auth_image_file(newVal) {
            if (!newVal) {
                this.idImgBenefAuthSrc = null;
            }
        },

    },

    computed: {
        newRefNumber() {
            return this.generateReferenceNumber();
        },
        newPassword() {
            return this.generatePassword();
        },
        isFormValid() {
            return (
                this.email &&
                this.firstName &&
                this.middleName &&
                this.lastName &&
                this.birthDate &&
                this.benefAge &&
                this.addressLine1 &&
                this.addressLine2 &&
                this.addressLine3 &&
                this.contactNumber &&
                this.benefGender &&
                this.benefBloodType &&
                this.benefCategory &&
                this.id_image_file &&
                this.benef_auth_image_file &&
                this.benefAuthPersonFirstName &&
                this.benefAuthPersonMiddleName &&
                this.benefAuthPersonLastName
                
            );
        },
    },
    methods: {
        back() {
            this.$router.go(-1);
        },

        async generateReferenceNumber() {
            const generatedNumber = Math.random().toString().slice(2, 14);
            return generatedNumber;
        },

        async generatePassword() {
            const generatedPassword = Math.random().toString().slice(2, 8);
            return generatedPassword;
        },

        showConfirmDialog() {
            if (this.isFormValid) this.confirmDialog = true;
        },

        closeConfirmDialog() {
            this.confirmDialog = false;
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

        // Create New Benefeciary
        async submitForm() {
            this.confirmDialog = false;
            this.loadingStore.show("Submitting...");
            try {
                if (!this.$refs.benefeciaryForm.validate()) return;
                this.validatingBenefeciary = true;
                let refNumber = typeof this.newRefNumber === 'function' || typeof this.newRefNumber?.then === 'function'
                    ? await this.newRefNumber
                    : this.newRefNumber;
                if (!refNumber) {
                    this.showError("Invalid generating ID number. Refresh page!");
                    return;
                }
                let myPassword = typeof this.newPassword === 'function' || typeof this.newPassword?.then === 'function'
                    ? await this.newPassword
                    : this.newPassword;
                if (!myPassword) {
                    this.showError("Invalid generating password. Refresh page!");
                    return;
                }
                const payload = new FormData();
                payload.append("email", this.email);
                payload.append("password", myPassword);
                payload.append("reference_number", refNumber);
                payload.append("first_name", this.firstName);
                payload.append("middle_name", this.middleName);
                payload.append("last_name", this.lastName);
                payload.append("birthdate", this.birthDate);
                payload.append("benef_age", this.benefAge);
                payload.append("address_line1", this.addressLine1);
                payload.append("address_line2", this.addressLine2);
                payload.append("address_line3", this.addressLine3);
                payload.append("contact_number", this.contactNumber);
                payload.append("suffix", this.benefSuffix);
                payload.append("gender_id", this.benefGender);
                payload.append("bloodtype_id", this.benefBloodType);
                payload.append("category_id", this.benefCategory);
                payload.append("benef_auth_person_first_name", this.benefAuthPersonFirstName);
                payload.append("benef_auth_person_middle_name", this.benefAuthPersonMiddleName);
                payload.append("benef_auth_person_last_name", this.benefAuthPersonLastName);
                
                if (this.id_image_file) {
                    const IdImageFile = Array.isArray(this.id_image_file)
                        ? this.id_image_file[0]
                        : this.id_image_file;
                    const compressedFile = await this.compressImage(IdImageFile);
                    payload.append("id_image_file", compressedFile);
                }

                if (this.benef_auth_image_file) {
                    const IdImageFile = Array.isArray(this.benef_auth_image_file)
                        ? this.benef_auth_image_file[0]
                        : this.benef_auth_image_file;
                    const compressedFile = await this.compressImage(IdImageFile);
                    payload.append("benef_auth_image_file", compressedFile);
                }
                

                await this.benefeciaryStore.saveNewBenefStore(payload);
                this.validatingBenefeciary = false;
                this.showSuccess("New benefeciary successfully saved!");
                this.idImgSrc = null;
                this.idImgBenefAuthSrc = null;
                this.$refs.benefeciaryForm.reset();
                this.$router.push({ name: 'AllBenefeciaries' });
            } catch (error) {
                this.showError(error);
                console.error(error);
            } finally {
                this.validatingBenefeciary = false;
                this.loadingStore.hide();
            }
        },

        previewIdImage() {
            if (this.id_image_file && this.id_image_file instanceof File) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.idImgSrc = e.target.result;
                };
                reader.readAsDataURL(this.id_image_file);
            } else {
                this.idImgSrc = null;
            }
        },

        previewBenefAuthIdImage() {
            if (this.benef_auth_image_file && this.benef_auth_image_file instanceof File) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.idImgBenefAuthSrc = e.target.result;
                };
                reader.readAsDataURL(this.benef_auth_image_file);
            } else {
                this.idImgBenefAuthSrc = null;
            }
        },

        async getOptions(endpoint, targetArray, errorMessage) {
            try {
                const response = await apiClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                this[targetArray] = response.data;
            } catch (error) {
                this.$refs.snackbarRef.showSnackbar(errorMessage, 'error');
            }
        },

        getBarangayOption() {
            this.getOptions('/admin/barangay-option', 'barangayOption', 'Failed to fetch gender');
        },

        getBenefGenderOption() {
            this.getOptions('/admin/gender-option', 'benefGenderOption', 'Failed to fetch gender');
        },

        getBenefBloodTypeOption() {
            this.getOptions('/admin/blood-type-option', 'benefBloodTypeOption', 'Failed to fetch blood type');
        },

        getBenefCategoryOption() {
            this.getOptions('/admin/category-option', 'benefCategoryOption', 'Failed to fetch category');
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