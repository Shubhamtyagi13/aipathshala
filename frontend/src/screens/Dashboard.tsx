import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function DashboardScreen({ navigation }: any) {

    const navigateTo = (screenName: string) => {
        navigation.navigate(screenName);
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Namaste, Student!</Text>
                <Text style={styles.subGreeting}>AI Pathshala is ready to optimize your revisions.</Text>
            </View>

            <View style={styles.grid}>

                {/* Magic Camera Route */}
                <TouchableOpacity style={styles.card} onPress={() => navigateTo('MagicCamera')}>
                    <View style={[styles.iconWrapper, { backgroundColor: 'rgba(249, 115, 22, 0.2)' }]}>
                        <Text style={styles.icon}>📷</Text>
                    </View>
                    <Text style={styles.cardTitle}>Magic Camera</Text>
                    <Text style={styles.cardDesc}>Scan NCERT pages for instant model solutions</Text>
                </TouchableOpacity>

                {/* Smart Kunji Route */}
                <TouchableOpacity style={styles.card} onPress={() => navigateTo('SmartKunji')}>
                    <View style={[styles.iconWrapper, { backgroundColor: 'rgba(56, 189, 248, 0.2)' }]}>
                        <Text style={styles.icon}>📖</Text>
                    </View>
                    <Text style={styles.cardTitle}>Smart Kunji</Text>
                    <Text style={styles.cardDesc}>View stored marking schemes and board templates</Text>
                </TouchableOpacity>

                {/* Mastery Map Route */}
                <TouchableOpacity style={styles.card} onPress={() => navigateTo('MasteryMap')}>
                    <View style={[styles.iconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                        <Text style={styles.icon}>🕸️</Text>
                    </View>
                    <Text style={styles.cardTitle}>Mastery Map</Text>
                    <Text style={styles.cardDesc}>Diagnose cross-grade foundation gaps</Text>
                </TouchableOpacity>

                {/* Tapasya Mode Route */}
                <TouchableOpacity style={styles.card} onPress={() => navigateTo('TapasyaMode')}>
                    <View style={[styles.iconWrapper, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
                        <Text style={styles.icon}>🧘</Text>
                    </View>
                    <Text style={styles.cardTitle}>Tapasya Mode</Text>
                    <Text style={styles.cardDesc}>Activate distraction-free focus learning</Text>
                </TouchableOpacity>

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617', // Slate 950
        padding: 16,
    },
    header: {
        paddingVertical: 32,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        marginBottom: 24,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
        marginBottom: 8,
    },
    subGreeting: {
        fontSize: 16,
        color: '#94a3b8',
        lineHeight: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#0f172a', // Slate 900
        width: '48%',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1e293b',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    icon: {
        fontSize: 24,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#f8fafc',
        marginBottom: 6,
    },
    cardDesc: {
        fontSize: 13,
        color: '#94a3b8',
        lineHeight: 18,
    }
});
