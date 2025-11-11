<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container class="mt-3">
        <h2>Beneficiary Info</h2>
        <v-row>
            <v-col cols="12" lg="6" md="6" sm="12">
                <v-card class="pa-2 mt-3">
                    <v-card-text>
                        <div class="d-flex align-center justify-center">
                            <img :src="imgSrc" alt="Beneficiary Image" />
                        </div>
                        <div class="d-flex flex-column mt-5">
                            <h3>Name:  
                                <span>{{ this.first_name }} {{ this.middle_name }} {{ this.last_name }} {{ this.suffix }}</span>
                            </h3>  
                            <h3>Age:  
                                <span>{{ this.benef_age }}</span>
                            </h3>
                            <h3>Address:  
                                <span>{{ this.address_line1 }}, Brgy. {{ this.barangay_name }}, {{ this.address_line3 }}</span>
                            </h3>   
                            <h3>Birthdate:  
                                <span>{{ formatDateTime(this.birthdate) }}</span>
                            </h3>
                            <h3>Gender:  
                                <span>{{ this.gender_label }}</span>
                            </h3>
                            <h3>Blood type:  
                                <span>{{ this.bloodtype_label }}</span>
                            </h3>
                            <h3>Beneficiary type:  
                                <span>{{ this.category_label }}</span>
                            </h3>
                            <h3>Contact no.:  
                                <span>{{ this.contact_number }}</span>
                            </h3>
                            <h3>Email:  
                                <span>{{ this.email }}</span>
                            </h3>

                            <h2 class="mt-4">Authorize person</h2>
                            <h3>Name:  
                                <span>
                                    {{ this.benef_auth_person_first_name }}
                                    {{ this.benef_auth_person_middle_name }}
                                    {{ this.benef_auth_person_last_name }}
                                </span>
                            </h3>
                            <h3>Image: </h3>
                            <img :src="imgAuthPersonSrc" alt="Authorize Person Image" />
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { useBenefeciaryStore } from '@/stores/benefeciaryStore';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Reference',

    data() {
        return {
            reference: this.$route.params.reference || 'No reference provided',
            beneficiary_data: null,
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: '',
            benef_age: '',
            address_line1: '',
            barangay_name: '',
            address_line3: '',
            gender_label: '',
            bloodtype_label: '',
            category_label: '',
            contact_number: '',
            email: '',
            benef_auth_person_first_name: '',
            benef_auth_person_middle_name: '',
            benef_auth_person_last_name: '',
            imgSrc: null,
            imgAuthPersonSrc: null,
        };
    },

    setup() {
        const beneficiaryStore = useBenefeciaryStore();
        const currentDate = new Date().toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
        const formatCurrentDate = currentDate.replace(/,/g, '');
        return { beneficiaryStore, formatCurrentDate };
    },

    mounted() {
        this.fetchBeneficiary(this.reference);
        this.fetchImageID(this.reference);
        this.fetchAuthPersonImageID(this.reference);
    },

    beforeUnmount() {
        if (this.imgSrc) {
            URL.revokeObjectURL(this.imgSrc);
        }
        if (this.imgAuthPersonSrc) {
            URL.revokeObjectURL(this.imgAuthPersonSrc);
        }
    },

    methods: {

        async fetchBeneficiary(reference) {
            try {
                const response = await this.beneficiaryStore.fetchBeneficiaryStore(reference);
                this.beneficiary_data = response.data;
                this.first_name = this.beneficiary_data[0].first_name || '';
                this.middle_name = this.beneficiary_data[0].middle_name || '';
                this.last_name = this.beneficiary_data[0].last_name || '';
                this.suffix = this.beneficiary_data[0].suffix || '';
                this.birthdate = this.beneficiary_data[0].birthdate || '';
                this.benef_age = this.beneficiary_data[0].benef_age || '';
                this.address_line1 = this.beneficiary_data[0].address_line1 || '';
                this.barangay_name = this.beneficiary_data[0].barangay_name || '';
                this.address_line3 = this.beneficiary_data[0].address_line3 || '';
                this.gender_label = this.beneficiary_data[0].gender_label || '';
                this.bloodtype_label = this.beneficiary_data[0].bloodtype_label || '';
                this.category_label = this.beneficiary_data[0].category_label || '';
                this.contact_number = this.beneficiary_data[0].contact_number || '';
                this.email = this.beneficiary_data[0].email || '';
                this.benef_auth_person_first_name = this.beneficiary_data[0].benef_auth_person_first_name || '';
                this.benef_auth_person_middle_name = this.beneficiary_data[0].benef_auth_person_middle_name || '';
                this.benef_auth_person_last_name = this.beneficiary_data[0].benef_auth_person_last_name || '';
            } catch (error) {
                console.error(error);

            }
        },

        async fetchImageID(reference) {
            try {
                const qrCodeBlob = await this.beneficiaryStore.fetchImageIDStore(reference);
                this.imgSrc = URL.createObjectURL(qrCodeBlob);
                if (!this.imgSrc) {
                    console.error('Failed to create image URL from blob');
                }
            } catch (error) {
                console.error('Error fetching beneficiary id:', error);
                this.imgSrc = '';
            }
        },

        async fetchAuthPersonImageID(reference) {
            try {
                const qrCodeBlob = await this.beneficiaryStore.fetchAuthPersonImageIDStore(reference);
                this.imgAuthPersonSrc = URL.createObjectURL(qrCodeBlob);
                if (!this.imgAuthPersonSrc) {
                    console.error('Failed to create image URL from blob');
                }
            } catch (error) {
                console.error('Error authorize person id:', error);
                this.imgAuthPersonSrc = '';
            }
        },

        formatDateTime(dateString) {
            if (!dateString) return 'N/A';
            const date = new Date(dateString);
            return date.toLocaleString('en-PH', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'Asia/Manila'
            });
        },
    },
};
</script>

<style scoped>
h3 {
    color: #949494;
    font-weight: normal;
    margin-bottom: 5px;
}

h3 span {
    color: #0086cf;
}

img {
    width: 140px;
    height: 140px;
    border-radius: 10px;
    margin-top: 8px;
}
</style>
