import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function MasteryMapScreen() {

    // Mocked Neo4j Output Data linking concepts across grades
    const graphNodes = [
        { id: 1, level: 'Grade 10', topic: 'Light: Reflection & Refraction', status: 'current', color: '#f97316' },
        { id: 2, level: 'Grade 8', topic: 'Some Natural Phenomena (Mirrors)', status: 'prerequisite_met', color: '#10b981' }, // Green
        { id: 3, level: 'Grade 7', topic: 'Rectilinear Propagation of Light', status: 'prerequisite_gap', color: '#ef4444' } // Red
    ];

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Knowledge Graph</Text>
                <Text style={styles.subtitle}>Neo4j Mastery Tracker</Text>
            </View>

            <View style={styles.treeContainer}>
                {graphNodes.map((node, index) => (
                    <View key={node.id} style={styles.nodeWrapper}>
                        <View style={[styles.nodeCircle, { borderColor: node.color }]}>
                            <Text style={styles.nodeLevel}>{node.level}</Text>
                        </View>
                        <View style={styles.nodeDetails}>
                            <Text style={styles.nodeTopic}>{node.topic}</Text>
                            <Text style={[styles.nodeStatus, { color: node.color }]}>
                                {node.status.replace('_', ' ').toUpperCase()}
                            </Text>
                        </View>
                        {/* Draw a connecting line if not the last node */}
                        {index < graphNodes.length - 1 && <View style={styles.line} />}
                    </View>
                ))}
            </View>

            <View style={styles.actionCard}>
                <Text style={styles.actionTitle}>Foundation Gap Detected</Text>
                <Text style={styles.actionDesc}>Your mastery of Grade 7 Rectilinear Propagation is low. Let's fix this foundation before continuing Grade 10 Physics.</Text>
                <View style={styles.actionButton}>
                    <Text style={styles.actionButtonText}>Start Bridge Module</Text>
                </View>
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
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#f8fafc',
    },
    subtitle: {
        fontSize: 16,
        color: '#94a3b8',
        marginTop: 4,
    },
    treeContainer: {
        paddingLeft: 20,
        marginBottom: 40,
    },
    nodeWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 10,
        position: 'relative',
    },
    nodeCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 3,
        backgroundColor: '#0f172a',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    nodeLevel: {
        color: '#f8fafc',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    nodeDetails: {
        marginLeft: 20,
        flex: 1,
        justifyContent: 'center',
        paddingTop: 8,
    },
    nodeTopic: {
        color: '#f8fafc',
        fontSize: 18,
        fontWeight: '600',
    },
    nodeStatus: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 4,
    },
    line: {
        position: 'absolute',
        left: 29,
        top: 60,
        width: 2,
        height: 50,
        backgroundColor: '#1e293b',
        zIndex: 1,
    },
    actionCard: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)', // Faint red
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: '#ef4444',
    },
    actionTitle: {
        color: '#f8fafc',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    actionDesc: {
        color: '#cbd5e1',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    actionButton: {
        backgroundColor: '#ef4444',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    actionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    }
});
