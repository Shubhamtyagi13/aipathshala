import axios from 'axios';

// In production, this would be an environment variable (e.g., https://api.aipathshala.in)
// For local Expo development targeting a local Node backend on port 3000, 
// use your machine's local IP address instead of 'localhost' if running on a physical device.
const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const aipathshalaAPI = {
    /**
     * Upload an image to the Ephemeral Pipeline for OCR and Metadata validation
     */
    uploadScan: async (imageUri: string) => {
        try {
            const formData = new FormData();
            // Required type casting for React Native's FormData implementation
            formData.append('image', {
                uri: imageUri,
                name: `scan_${Date.now()}.jpg`,
                type: 'image/jpeg',
            } as any);

            const response = await api.post('/scan', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            console.error('[API Service] Failed to upload scan:', error);
            throw error;
        }
    },

    /**
     * Initialize a Razorpay checkout session
     */
    createBillingOrder: async (amount: number, metadata: any = {}) => {
        try {
            const response = await api.post('/pay/create-order', {
                amount,
                metadata
            });
            return response.data;
        } catch (error) {
            console.error('[API Service] Failed to create billing order:', error);
            throw error;
        }
    }
};

export default api;
