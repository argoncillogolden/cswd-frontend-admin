import { defineStore } from 'pinia';
import apiClient from '@/axios';

export const useBenefOptionStore = defineStore('benefOption', {
    state: () => ({
        governmentTierOption: [],
        barangayOption: [],
        benefGenderOption: [],
        benefBloodTypeOption: [],
        benefCategoryOption: [],
        handOverStatusOption: [],
        benefStatusOption: [],
        isLoading: false,
        error: null,
    }),

    getters: {
        // Optional: Add getters if you need computed properties
        getGovernmentTierOption: (state) => state.governmentTierOption,
        getBarangayOption: (state) => state.barangayOption,
        getBenefGenderOption: (state) => state.benefGenderOption,
        getBenefBloodTypeOption: (state) => state.benefBloodTypeOption,
        getBenefCategoryOption: (state) => state.benefCategoryOption,
        getHandOverStatusOption: (state) => state.handOverStatusOption,
        getBenefStatusOption: (state) => state.benefStatusOption,
    },

    actions: {
        async fetchOptions(endpoint) {
            try {
                const response = await apiClient.get(endpoint, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
                    },
                });
                return response.data;
            } catch (error) {
                this.error = error;
                console.error(`Failed to fetch options from ${endpoint}:`, error);
                throw error;
            }
        },
        
        async fetchAllOptions() {
            this.isLoading = true;
            try {
                const [genders, bloodtypes, categories, benefStatus] = await Promise.all([
                    this.fetchOptions('/admin/gender-option'),
                    this.fetchOptions('/admin/blood-type-option'),
                    this.fetchOptions('/admin/category-option'),
                    this.fetchOptions('/admin/benef-status-option'),
                ]);
                this.benefGenderOption = genders;
                this.benefBloodTypeOption = bloodtypes;
                this.benefCategoryOption = categories;
                this.benefStatusOption = benefStatus;
            } catch (error) {
                this.error = error;
                console.error('Failed to fetch all options:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchGovernmentTierOption() {
            this.isLoading = true;
            try {
                const [governmentTier] = await Promise.all([
                    this.fetchOptions('/admin/government-tier-option'),
                ]);
                this.governmentTierOption = governmentTier;
            } catch (error) {
                this.error = error;
                console.error('Failed to fetch all options:', error);
            } finally {
                this.isLoading = false;
            }
        },

        // async fetchBarangaysOption() {
        //     this.isLoading = true;
        //     try {
        //         const [governmentTier] = await Promise.all([
        //             await axios.get(`http://localhost:8000/api/psgc/barangays`),
        //         ]);
        //         this.governmentTierOption = governmentTier;
        //     } catch (error) {
        //         this.error = error;
        //         console.error('Failed to fetch all options:', error);
        //     } finally {
        //         this.isLoading = false;
        //     }
        // },

        async fetchBarangayOption() {
            this.isLoading = true;
            try {
                const [barangays] = await Promise.all([
                    this.fetchOptions('/admin/barangay-option'),
                ]);
                this.barangayOption = barangays;
            } catch (error) {
                this.error = error;
                console.error('Failed to fetch all options:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchHandOverOptions() {
            this.isLoading = true;
            try {
                const [categories, handOverStatus] = await Promise.all([
                    this.fetchOptions('/admin/category-option'),
                    this.fetchOptions('/admin/hand-over-status-option'),
                ]);
                this.benefCategoryOption = categories;
                this.handOverStatusOption = handOverStatus;
            } catch (error) {
                this.error = error;
                console.error('Failed to fetch all options:', error);
            } finally {
                this.isLoading = false;
            }
        },

        async fetchcategoryOptions() {
            this.isLoading = true;
            try {
                const [categories] = await Promise.all([
                    this.fetchOptions('/admin/category-option'),
                ]);
                this.benefCategoryOption = categories;
            } catch (error) {
                this.error = error;
                console.error('Failed to fetch all options:', error);
            } finally {
                this.isLoading = false;
            }
        },
    },
});