import React, { useState } from 'react';
import { Text, View, TouchableOpacity, TextInput, Dimensions, StyleSheet } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';

export default function CreateProfil({ navigation }) {
    const { width, height } = Dimensions.get('window');
    const circleSize = Math.min(width, height) * 0.3;

    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        username: '',
        genre: null,
        dateNaissance: '',
        poids: '',
        taille: '',
        goals: [],
        level: null,
    });

    const nextStep = () => setStep(step + 1);

    const selectGenre = (genre) => {
        setUserData({ ...userData, genre });
        nextStep();
    };

    const toggleGoal = (goal) => {
        setUserData((prevData) => {
            const isGoalSelected = prevData.goals.includes(goal);
            return {
                ...prevData,
                goals: isGoalSelected
                    ? prevData.goals.filter((g) => g !== goal)
                    : [...prevData.goals, goal],
            };
        });
    };

    const saveData = async () => {
        try {
            await AsyncStorage.setItem('userProfile', JSON.stringify(userData));
            navigation.navigate('HomeScreen');
        } catch (error) {
            console.error('Failed to save data', error);
        }
    };

    return (
        <View style={styles.container}>
            {step === 1 && (
                <>
                    <Text style={styles.title}>Quel est ton genre ?</Text>

                    <TouchableOpacity
                        onPress={() => selectGenre('Homme')}
                        style={[styles.circle, { backgroundColor: '#FF9119', width: circleSize, height: circleSize }]}
                    >
                        <Icon name="mars" size={circleSize * 0.4} color="#fff" />
                        <Text style={styles.circleText}>Homme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => selectGenre('Femme')}
                        style={[styles.circle, { backgroundColor: '#008000', width: circleSize, height: circleSize }]}
                    >
                        <Icon name="venus" size={circleSize * 0.4} color="#fff" />
                        <Text style={styles.circleText}>Femme</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => selectGenre('Ne pas spécifier')}
                        style={styles.skipButton}
                    >
                        <Text style={styles.skipButtonText}>Ne pas spécifier</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 2 && (
                <>
                    <Text style={styles.title}>Choisis un pseudo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Saisissez votre pseudo"
                        value={userData.username}
                        onChangeText={(value) => setUserData({ ...userData, username: value })}
                    />
                    <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Suivant</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 3 && (
                <>
                    <Text style={styles.title}>Quelle est ta date de naissance ?</Text>
                    <DateTimePicker
                        mode="single"
                        date={userData.dateNaissance ? dayjs(userData.dateNaissance) : dayjs()}
                        onChange={({ date }) => {
                            setUserData({ ...userData, dateNaissance: date.toISOString() });
                        }}
                        minDate={dayjs().subtract(100, 'years')}
                        maxDate={dayjs()}
                        height={350}
                        selectedTextStyle={{ color: '#0047FF' }}
                    />
                    <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
                        <Text style={styles.nextButtonText}>Suivant</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 4 && (
                <>
                    <Text style={styles.title}>
                        Quel est ton poids ?
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Saisissez votre poids (kg)"
                        keyboardType="numeric"
                        value={userData.poids}
                        onChangeText={(value) => setUserData({ ...userData, poids: value })}
                    />
                    <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Suivant</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 5 && (
                <>
                    <Text style={styles.title}>
                        Quelle est ta taille ?
                    </Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Saisissez votre taille (cm)"
                        keyboardType="numeric"
                        value={userData.taille}
                        onChangeText={(value) => setUserData({ ...userData, taille: value })}
                    />
                    <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Suivant</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 6 && (
                <>
                    <Text style={styles.title}>
                        Quel est ton goal ?
                    </Text>
                    {['Etre en forme', 'Gagner du muscle', 'Perdre du poids', 'Augmenter l\'endurance', 'Améliorer la santé générale', 'Autres'].map((goal) => (
                        <TouchableOpacity
                            key={goal}
                            onPress={() => toggleGoal(goal)}
                            style={[
                                styles.optionButton,
                                userData.goals.includes(goal) ? styles.optionButtonSelected : styles.optionButtonUnselected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionButtonText,
                                    userData.goals.includes(goal) ? styles.optionButtonTextSelected : styles.optionButtonTextUnselected,
                                ]}
                            >
                                {goal}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={nextStep} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Suivant</Text>
                    </TouchableOpacity>
                </>
            )}

            {step === 7 && (
                <>
                    <Text style={styles.title}>
                        Quel est ton niveau ?
                    </Text>
                    {['Débutant', 'Intermédiaire', 'Avancé'].map((level) => (
                        <TouchableOpacity
                            key={level}
                            onPress={() => setUserData({ ...userData, level })}
                            style={[
                                styles.optionButton,
                                userData.level === level ? styles.optionButtonSelected : styles.optionButtonUnselected,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.optionButtonText,
                                    userData.level === level ? styles.optionButtonTextSelected : styles.optionButtonTextUnselected,
                                ]}
                            >
                                {level}
                            </Text>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity onPress={saveData} style={styles.nextButton}>
                        <Text style={styles.nextButtonText}>Terminer</Text>
                    </TouchableOpacity>
                </>
            )}

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6',
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginBottom: 24,
    },
    circle: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 1000, // S'assure que c'est un cercle parfait
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Pour l'ombre sur Android

    },
    
    circleText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 18,
        marginTop: 8,
    },
    
    skipButton: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginTop: 16,
    },
    skipButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        textAlign: 'center',
        fontSize: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    nextButtonText: {
        color: '#FFF',
        fontSize: 18,
        textAlign: 'center',
    },
    optionButton: {
        width: '80%',
        paddingVertical: 16,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    optionButtonSelected: {
        backgroundColor: '#007bff', // Blue for selected options
    },
    optionButtonUnselected: {
        backgroundColor: '#e2e8f0', // Gray for unselected options
    },
    optionButtonText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    optionButtonTextSelected: {
        color: '#fff', // White text for selected options
    },
    optionButtonTextUnselected: {
        color: '#000', // Black text for unselected options
    },
});