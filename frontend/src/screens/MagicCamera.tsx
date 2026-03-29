import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { aipathshalaAPI } from '../services/api';

export default function MagicCameraScreen({ navigation }: any) {
    const [permission, requestPermission] = useCameraPermissions();
    const [isProcessing, setIsProcessing] = useState(false);
    const [scanResult, setScanResult] = useState<any>(null);
    const cameraRef = useRef<CameraView>(null);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <TouchableOpacity style={styles.button} onPress={requestPermission}>
                    <Text style={styles.text}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const takePicture = async () => {
        if (cameraRef.current && !isProcessing) {
            setIsProcessing(true);
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8, // 300-600 DPI equivalent for typical mobile sensors
                    base64: true,
                });

                if (photo) {
                    try {
                        // 1. Send scan to Ephemeral API constraint
                        const response = await aipathshalaAPI.uploadScan(photo.uri);
                        setScanResult({
                            board: response.data?.board,
                            class: response.data?.class,
                            topic: response.data?.topic,
                        });
                    } catch (apiError) {
                        console.error("API Error", apiError);
                        alert("API Error: Unable to extract metadata. Check that the backend is running and valid keys are provided.");
                    }
                }
            } catch (error) {
                console.error(error);
            } finally {
                setIsProcessing(false);
            }
        }
    };

    const pickImage = async () => {
        if (isProcessing) return;
        
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            base64: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setIsProcessing(true);
            try {
                const photoUri = result.assets[0].uri;
                const response = await aipathshalaAPI.uploadScan(photoUri);
                setScanResult({
                    board: response.data?.board,
                    class: response.data?.class,
                    topic: response.data?.topic,
                });
            } catch (error) {
                console.error(error);
                alert("Failed to extract metadata. Make sure the server is running and keys are valid.");
            } finally {
                setIsProcessing(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            {scanResult ? (
                <View style={styles.overlay}>
                    <Text style={styles.overlayTitle}>Scan Detected!</Text>
                    <Text style={styles.overlayText}>Board: {scanResult.board}</Text>
                    <Text style={styles.overlayText}>Class: {scanResult.class}</Text>
                    <Text style={styles.overlayText}>Topic: {scanResult.topic}</Text>

                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: '#10b981', marginTop: 30 }]}
                        onPress={() => navigation.replace('SmartKunji', { metadata: scanResult })}
                    >
                        <Text style={styles.text}>View Smart Kunji Solution</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={() => setScanResult(null)}>
                        <Text style={styles.text}>Scan Another</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <CameraView style={styles.camera} facing="back" ref={cameraRef}>
                    <View style={styles.arFrame}>
                        {/* AR Guidelines */}
                        <View style={styles.cornerTopLeft} />
                        <View style={styles.cornerTopRight} />
                        <View style={styles.cornerBottomLeft} />
                        <View style={styles.cornerBottomRight} />
                        <Text style={styles.arText}>Align NCERT Textbook Here</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                        {isProcessing ? (
                            <View style={styles.processingBtn}>
                                <ActivityIndicator size="large" color="#f97316" />
                                <Text style={styles.processingText}>Analyzing 7-Layer Metadata...</Text>
                            </View>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                                <TouchableOpacity style={styles.secondaryButton} onPress={pickImage}>
                                    <Text style={styles.secondaryButtonText}>Upload Image</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                                    <View style={styles.innerCaptureButton} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </CameraView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#020617',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
        color: '#f8fafc',
    },
    camera: {
        flex: 1,
    },
    arFrame: {
        flex: 1,
        margin: 40,
        marginTop: 80,
        marginBottom: 160,
        borderWidth: 2,
        borderColor: 'rgba(249, 115, 22, 0.3)', // Faint orange
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    arText: {
        color: 'rgba(249, 115, 22, 0.8)',
        fontSize: 18,
        fontWeight: '600',
    },
    cornerTopLeft: { position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTopWidth: 4, borderLeftWidth: 4, borderColor: '#f97316' },
    cornerTopRight: { position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTopWidth: 4, borderRightWidth: 4, borderColor: '#f97316' },
    cornerBottomLeft: { position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottomWidth: 4, borderLeftWidth: 4, borderColor: '#f97316' },
    cornerBottomRight: { position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottomWidth: 4, borderRightWidth: 4, borderColor: '#f97316' },
    buttonContainer: {
        paddingBottom: 40,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(248, 250, 252, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerCaptureButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#f8fafc',
    },
    secondaryButton: {
        backgroundColor: 'rgba(2, 6, 23, 0.7)',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#f97316',
    },
    secondaryButtonText: {
        color: '#f97316',
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#ea580c',
        padding: 15,
        borderRadius: 8,
        marginTop: 20,
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    processingBtn: {
        alignItems: 'center',
    },
    processingText: {
        color: '#f97316',
        marginTop: 10,
        fontWeight: 'bold',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0f172a',
    },
    overlayTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f97316',
        marginBottom: 20,
    },
    overlayText: {
        fontSize: 20,
        color: '#f8fafc',
        marginBottom: 10,
    }
});
