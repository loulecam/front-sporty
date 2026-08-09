import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function TrainingMenu({ navigation }) {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.startButton}
                onPress={() => navigation.navigate('StartTraining')}>
                <Text style={styles.buttonText}>Lancer Entrainement</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.exploreButton}
                onPress={() => navigation.navigate('ExploreRoutine')}>
                <Text style={styles.buttonText}>Explorer les routines</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    startButton: {
        backgroundColor: '#3b82f6', // Bleu
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginBottom: 16,
    },
    exploreButton: {
        backgroundColor: '#10b981', // Vert
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
});
