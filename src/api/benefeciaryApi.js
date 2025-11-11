import apiClient from "../axios";

export const BENEFECIARY_API = {
    ENDPOINTS: {
        SAVE_NEW_BENEFECIARY: "/admin/save-new-benefeciary",
        SAVE_NEW_HAND_OVER: "/admin/save-new-hand-over",
        FETCH_ALL_BENEFECIARIES: "/admin/all-benefeciaries",
        FETCH_ALL_FILTERED_BENEFECIARIES: "/admin/all-filtered-benefeciaries",
        FETCH_BENEFECIARY_INFO: "/admin/benefeciary-info",
        FETCH_ALL_HAND_OVERS: "/admin/all-hand-overs",
        FETCH_HAND_OVER_EVENT: "/admin/hand-over-event",
        FETCH_BENEFECIARIES_COUNT: "/admin/benefeciaries-count",
        FETCH_PWDS_COUNT: "/admin/benefeciaries-pwds-count",
        FETCH_SENIORS_COUNT: "/admin/benefeciaries-seniors-count",
        FETCH_HANDOVER_COUNT: "/admin/hand-overs-count",
        FETCH_QR_TEMP: "/admin/get-qr-temp",
        FETCH_IMAGE_ID: "/admin/get-image-id",
        FETCH_IMAGE_AUTH_PERSON_ID: "/benefeciary/benefeciary-auth-person-image",
        UPDATE_BENEFECIARY_INFO: "/admin/update-benef",
        UPDATE_HAND_OVER_INFO: "/admin/update-hand-over",
        UPDATE_HAND_OVER_STATUS: "/admin/update-hand-over-status",
    },

    // Create
    async saveNewBenefApi(benefeciaryData) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            // Post request for submission
            const response = await apiClient.post(
                this.ENDPOINTS.SAVE_NEW_BENEFECIARY,
                benefeciaryData,
                config
            );

            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error saving benefeciary:", error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to save benefeciary"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async saveNewHandOverApi(handOverData) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            const response = await apiClient.post(
                this.ENDPOINTS.SAVE_NEW_HAND_OVER,
                handOverData,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error saving benefeciary:", error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to save benefeciary"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    // Read
    async fetchAllBenefApi() {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await apiClient.get(
                this.ENDPOINTS.FETCH_ALL_BENEFECIARIES,
                config
            );

            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error fetching benefeciaries:", error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch benefeciaries"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchAllFilteredBenefApi(filterParams) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_ALL_FILTERED_BENEFECIARIES}/${filterParams}`,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error fetching filtered benefeciaries:", error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch filtered benefeciaries"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchBeneficiaryApi(reference) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_BENEFECIARY_INFO}/${reference}`,
                config
            );

            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error fetching benefeciaries:", error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch benefeciaries"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchHandOverDatesApi() {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await apiClient.get(
                this.ENDPOINTS.FETCH_ALL_HAND_OVERS,
                config
            );

            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch benefeciaries"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchHandOverDateEventApi(handOverID) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_HAND_OVER_EVENT}/${handOverID}`,
                config
            );

            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message || error.message
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchTotalBenefApi() {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            let endpoint = this.ENDPOINTS.FETCH_BENEFECIARIES_COUNT;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async fetchTotalPWDApi() {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            let endpoint = this.ENDPOINTS.FETCH_PWDS_COUNT;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async fetchTotalSeniorsApi() {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            let endpoint = this.ENDPOINTS.FETCH_SENIORS_COUNT;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async fetchHandOverCountApi() {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            let endpoint = this.ENDPOINTS.FETCH_HANDOVER_COUNT;
            const response = await apiClient.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            throw error;
        }
    },

    async fetchOrderQRcodeTempApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: "blob",
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_QR_TEMP}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch order status"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchImageIDApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: "blob",
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_IMAGE_ID}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message || error.message
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchAuthPersonImageIDApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: "blob",
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_IMAGE_AUTH_PERSON_ID}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(error);
            const enhancedError = new Error(
                error.response?.data?.message || error.message
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    // Update
    async updateBenefInfoApi(benef) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            if (!benef.beneficiary_id) {
                throw new Error("Benefeciary ID is required for update");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await apiClient.post(
                `${this.ENDPOINTS.UPDATE_BENEFECIARY_INFO}/${benef.beneficiary_id}`,
                benef,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error updating product:", error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to update product"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async updateHandOverInfoApi(handOverData) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            if (!handOverData.hand_over_id) {
                throw new Error("Benefeciary ID is required for update");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
            };
            const response = await apiClient.post(
                `${this.ENDPOINTS.UPDATE_HAND_OVER_INFO}/${handOverData.hand_over_id}`,
                handOverData,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error("[BENEFECIARY_API] Error updating product:", error);
            const enhancedError = new Error(
                error.response?.data?.message || error.message
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async updateHandOverStatusApi(formData) {
        try {
            const authToken = localStorage.getItem("auth_token");
            if (!authToken) {
                throw new Error("No authentication token found");
            }
            const hand_over_id = formData.get("hand_over_id");
            if (!hand_over_id) {
                throw new Error("Hand-over ID is required for update");
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            const response = await apiClient.post(
                `${this.ENDPOINTS.UPDATE_HAND_OVER_STATUS}/${hand_over_id}`,
                formData,
                config
            );
            if (!response.data) {
                throw new Error("Invalid response from server");
            }
            return response.data;
        } catch (error) {
            console.error(
                "[BENEFECIARY_API] Error updating hand-over status:",
                error
            );
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                "Failed to update hand-over status"
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },
};
