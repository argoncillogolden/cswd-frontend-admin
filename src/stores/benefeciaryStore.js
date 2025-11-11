import { defineStore } from 'pinia';
import { BENEFECIARY_API } from '@/api/benefeciaryApi';

export const useBenefeciaryStore = defineStore('products', {
    state: () => ({
        allBenefeciaries: [],
        allHandOverDates: [],
        handOverDateEvent: [],
        handOverDataHeaderEvent: null,
        benefCount: null,
        pwdCount: null,
        seniorsCount: null,
        handOverCount: null,
        beneficiaryData: null,
        loading: false,
        error: null
    }),

    actions: {

        // Create
        async saveNewBenefStore(benefeciaryData) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.saveNewBenefApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.saveNewBenefApi(benefeciaryData);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async saveNewHandOverStore(handOverData) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.saveNewHandOverApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.saveNewHandOverApi(handOverData);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // Read
        async fetchAllBenefStore() {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchAllBenefApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchAllBenefApi();
                if (response && response.status === true) {
                    this.allBenefeciaries = response.data;
                } else {
                    throw new Error('Failed to fetch benefeciaries');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchAllFilteredBenefStore(filters = {}) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchAllFilteredBenefApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchAllFilteredBenefApi(filters);
                if (response && response.status === true) {
                    this.allBenefeciaries = response.data;
                } else {
                    throw new Error('Failed to fetch benefeciaries');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchBeneficiaryStore(reference) {
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchBeneficiaryApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchBeneficiaryApi(reference);
                if (response && response.status === true) {
                    return response;
                } else {
                    throw new Error('Failed to fetch benefeciaries');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.error = null;
            }
        },

        async fetchHandOverDatesStore() {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchHandOverDatesApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchHandOverDatesApi();
                if (response && response.status === true) {
                    this.allHandOverDates = response.data;
                } else {
                    throw new Error('Failed to fetch hand-over dates');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchHandOverDateEventStore(handOverID) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.fetchHandOverDateEventApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.fetchHandOverDateEventApi(handOverID);
                if (response && response.status === true) {
                    this.handOverDateEvent = response.data;
                    this.handOverDataHeaderEvent = response.data_header;
                } else {
                    throw new Error('Failed to fetch hand-over event data');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchTotalBenefStore() {
            this.loading = true;
            this.error = null;
            try {
                const response = await BENEFECIARY_API.fetchTotalBenefApi();
                if (response && response.status === true) {
                    this.benefCount = response.data;
                } else {
                    throw new Error(response?.message);
                }
            } catch (error) {
                console.error( error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchTotalPWDStore() {
            this.loading = true;
            this.error = null;
            try {
                const response = await BENEFECIARY_API.fetchTotalPWDApi();
                if (response && response.status === true) {
                    this.pwdCount = response.data;
                } else {
                    throw new Error(response?.message);
                }
            } catch (error) {
                console.error( error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchTotalSeniorsStore() {
            this.loading = true;
            this.error = null;
            try {
                const response = await BENEFECIARY_API.fetchTotalSeniorsApi();
                if (response && response.status === true) {
                    this.seniorsCount = response.data;
                } else {
                    throw new Error(response?.message);
                }
            } catch (error) {
                console.error( error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchHandOverCountStore() {
            this.loading = true;
            this.error = null;
            try {
                const response = await BENEFECIARY_API.fetchHandOverCountApi();
                if (response && response.status === true) {
                    this.handOverCount = response.data;
                } else {
                    throw new Error(response?.message);
                }
            } catch (error) {
                console.error( error);
                this.error = error.message;
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchQRcodeTempStore(referenceNumber) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const qrCodeBlob = await BENEFECIARY_API.fetchOrderQRcodeTempApi(referenceNumber);
                if (qrCodeBlob) {
                    this.benefQRCode = qrCodeBlob;
                    return qrCodeBlob;
                } else {
                    throw new Error('Failed to fetch QR Code');
                }
            } catch (error) {
                console.error(error);
                this.error = error.message || 'Failed to fetch QR Code';
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        async fetchImageIDStore(referenceNumber) {
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const imageBlob = await BENEFECIARY_API.fetchImageIDApi(referenceNumber);
                if (imageBlob) {
                    return imageBlob;
                } else {
                    throw new Error('Failed to fetch image ID');
                }
            } catch (error) {
                console.error(error);
                this.error = error.message || 'Failed to fetch image ID';
                throw error;
            }
        },

        async fetchAuthPersonImageIDStore(referenceNumber) {
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const imageBlob = await BENEFECIARY_API.fetchAuthPersonImageIDApi(referenceNumber);
                if (imageBlob) {
                    return imageBlob;
                } else {
                    throw new Error('Failed to fetch image ID');
                }
            } catch (error) {
                console.error(error);
                this.error = error.message || 'Failed to fetch image ID';
                throw error;
            }
        },

        // Update
        async updateBenefInfoStore(benefeciaryData) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.updateBenefInfoApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.updateBenefInfoApi(benefeciaryData);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary info');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateHandOverInfoStore(handOverData) {
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.updateHandOverInfoApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.updateHandOverInfoApi(handOverData);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary info');
                }
            } catch (error) {
                console.error(error);
                throw error;
            }
        },

        async updateHandOverStatusStore(handOverStatus) {
            this.loading = true;
            this.error = null;
            try {
                if (!BENEFECIARY_API || typeof BENEFECIARY_API.updateHandOverStatusApi !== 'function') {
                    throw new Error('BENEFECIARY_API service is not properly initialized');
                }
                const response = await BENEFECIARY_API.updateHandOverStatusApi(handOverStatus);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save benefeciary info');
                }
            } catch (error) {
                console.error(error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

    },
});