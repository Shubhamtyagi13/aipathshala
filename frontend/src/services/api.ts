import axios from 'axios';
import { Platform } from 'react-native';

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
            
            if (Platform.OS === 'web') {
                const res = await fetch(imageUri);
                const blob = await res.blob();
                formData.append('image', blob, `scan_${Date.now()}.jpg`);
            } else {
                // Required type casting for React Native's FormData implementation
                formData.append('image', {
                    uri: imageUri,
                    name: `scan_${Date.now()}.jpg`,
                    type: 'image/jpeg',
                } as any);
            }

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
     * Upload an NCERT PDF textbook to the automated Backend RAG Ingestion Pipeline
     */
    uploadPdf: async (fileUri: string, fileName: string) => {
        try {
            const formData = new FormData();
            
            if (Platform.OS === 'web') {
                const res = await fetch(fileUri);
                const blob = await res.blob();
                formData.append('document', blob, fileName);
            } else {
                formData.append('document', {
                    uri: fileUri,
                    name: fileName,
                    type: 'application/pdf',
                } as any);
            }

            const response = await api.post('/upload-pdf', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data;
        } catch (error) {
            console.error('[API Service] Failed to upload PDF:', error);
            throw error;
        }
    },

    /**
     * Retrieve the 7-Layer Metadata and RAG answer template for a specific topic
     */
    getKunjiData: async (topic: string, board: string) => {
        try {
            const response = await api.post('/kunji', { topic, board });
            return response.data.data;
        } catch (error) {
            console.error('[API Service] fetchKunjiData failed:', error);
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
