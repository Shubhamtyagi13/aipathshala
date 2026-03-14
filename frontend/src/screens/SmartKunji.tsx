import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function SmartKunjiScreen({ route }: any) {
    // Extract passed metadata dynamically, fallback to static defaults if navigated manually 
    const scanData = route?.params?.metadata || { board: 'CBSE', topic: 'Physics' };

    const modelAnswer = {
        goldenKeywords: ['Relative Optical Density', 'Vacuum', 'Refractive Index'],
        points: [
            `The relative optical density of a medium describes its ability to refract light passing through ${scanData.topic}.`,
            'It is mathematically expressed as the ratio of the speed of light in a vacuum to its speed in the specific medium.',
            'This ratio defines the absolute refractive index.'
        ],
        boardMarkingScheme: {
            total: '3M',
            breakdown: [
                { desc: 'Definition of Optical Density', mark: 1 },
                { desc: 'Ratio relationship to Vacuum', mark: 1 },
                { desc: 'Keyword inclusion: Refractive Index', mark: 1 }
            ]
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Model Answer</Text>
                    <Text style={styles.topicSubtitle}>{scanData.topic}</Text>
                </View>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{modelAnswer.boardMarkingScheme.total} {scanData.board}</Text>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Golden Keywords</Text>
                <View style={styles.tagsContainer}>
                    {modelAnswer.goldenKeywords.map((keyword, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{keyword}</Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Structured Answer</Text>
                {modelAnswer.points.map((point, index) => (
                    <View key={index} style={styles.pointContainer}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.pointText}>{point}</Text>
                    </View>
                ))}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Board Marker Schema</Text>
                {modelAnswer.boardMarkingScheme.breakdown.map((item, index) => (
                    <View key={index} style={styles.markRow}>
                        <Text style={styles.markDesc}>{item.desc}</Text>
                        <Text style={styles.markValue}>+{item.mark}</Text>
                    </View>
                ))}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    topicSubtitle: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 4,
    },
    badge: {
        backgroundColor: 'rgba(249, 115, 22, 0.2)', // Faded orange
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#ea580c',
    },
    badgeText: {
        color: '#f97316',
        fontWeight: 'bold',
    },
    card: {
        backgroundColor: '#0f172a', // Slate 900
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#1e293b', // Slate 800
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#cbd5e1', // Slate 300
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tag: {
        backgroundColor: '#1e293b',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 6,
    },
    tagText: {
        color: '#f97316', // Orange 500 emphasizes the golden keywords
        fontSize: 14,
        fontWeight: '500',
    },
    pointContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'flex-start',
    },
    bulletPoint: {
        color: '#f97316',
        fontSize: 20,
        marginRight: 10,
        lineHeight: 22,
    },
    pointText: {
        color: '#f8fafc',
        fontSize: 16,
        lineHeight: 24,
        flex: 1,
    },
    markRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
    },
    markDesc: {
        color: '#94a3b8',
        fontSize: 15,
    },
    markValue: {
        color: '#ea580c',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
