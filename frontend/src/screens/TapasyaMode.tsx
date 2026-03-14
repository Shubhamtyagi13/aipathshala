import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TapasyaModeScreen() {
    const [isTapasyaActive, setIsTapasyaActive] = useState(false);
    const [pulseAnim] = useState(new Animated.Value(1));

    useEffect(() => {
        if (isTapasyaActive) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isTapasyaActive]);

    return (
        <View style={[styles.container, isTapasyaActive && styles.activeContainer]}>
            {isTapasyaActive && (
                <LinearGradient
                    colors={['#ea580c', '#020617']}
                    style={styles.gradientBackground}
                />
            )}

            <View style={styles.header}>
                <Text style={styles.title}>Tapasya Mode</Text>
                <Text style={styles.subtitle}>Deep Focus. Zero Distractions.</Text>
            </View>

            <Animated.View style={[styles.statusCircle, { transform: [{ scale: pulseAnim }] }]}>
                <Text style={styles.statusText}>
                    {isTapasyaActive ? 'FOCUS ACTIVE' : 'READY'}
                </Text>
            </Animated.View>

            <View style={styles.controls}>
                <Text style={styles.controlLabel}>Block Non-Academic Notifications</Text>
                <Switch
                    value={isTapasyaActive}
                    onValueChange={setIsTapasyaActive}
                    trackColor={{ false: '#1e293b', true: '#f97316' }}
                    thumbColor={isTapasyaActive ? '#fff' : '#94a3b8'}
                />
            </View>

            {isTapasyaActive && (
                <View style={styles.statsCard}>
                    <Text style={styles.statsTitle}>Current Session</Text>
                    <Text style={styles.statsValue}>01:42:15</Text>
                    <Text style={styles.statsSubtitle}>Streak: 4 Days</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Slate 950
        alignItems: 'center',
        paddingTop: 60,
    },
    activeContainer: {
        backgroundColor: '#020617',
    },
    gradientBackground: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: 300,
        opacity: 0.15,
    },
    header: {
        alignItems: 'center',
        marginBottom: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
    },
    statusCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: '#ea580c',
        backgroundColor: 'rgba(234, 88, 12, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 60,
    },
    statusText: {
        color: '#f97316',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 2,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0f172a',
        padding: 20,
        borderRadius: 12,
        width: '85%',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#1e293b',
        marginBottom: 30,
    },
    controlLabel: {
        color: '#cbd5e1',
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    statsCard: {
        alignItems: 'center',
    },
    statsTitle: {
        color: '#94a3b8',
        fontSize: 14,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    statsValue: {
        color: '#f8fafc',
        fontSize: 48,
        fontWeight: '300',
        marginVertical: 4,
    },
    statsSubtitle: {
        color: '#f97316',
        fontWeight: 'bold',
    }
});
