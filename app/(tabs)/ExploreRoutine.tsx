import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    Modal,
    Dimensions,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

export default function ExploreRoutine({ navigation }) {
    const [sessionName, setSessionName] = useState('');
    const [description, setDescription] = useState('');
    const [exercises, setExercises] = useState([]);
    const [exerciseName, setExerciseName] = useState('');
    const [exerciseTime, setExerciseTime] = useState('');
    const [restTime, setRestTime] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);

    const addExercise = () => {
        if (!exerciseName || !exerciseTime || !restTime) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs pour ajouter un exercice.');
            return;
        }

        setExercises([...exercises, { name: exerciseName, time: exerciseTime, rest: restTime }]);
        setExerciseName('');
        setExerciseTime('');
        setRestTime('');
        setIsModalVisible(false); 
    };

    const saveSession = async () => {
        if (!sessionName || !description || exercises.length === 0) {
            Alert.alert('Erreur', 'Veuillez remplir le nom de la session, la description et ajouter au moins un exercice.');
            return;
        }

        const session = {
            name: sessionName,
            description,
            exercises,
        };

        const fileUri = `${FileSystem.documentDirectory}${sessionName}.json`;

        try {
            await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(session));
            Alert.alert('Succès', `Votre séance a été sauvegardée avec succès !`);
        } catch (error) {
            Alert.alert('Erreur', `Une erreur est survenue lors de la sauvegarde : ${error.message}`);
        }

        setSessionName('');
        setDescription('');
        setExercises([]);
        navigation.navigate('StartTraining');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Créer une séance de sport</Text>

            <TextInput
                style={styles.input}
                placeholder="Nom de la session"
                value={sessionName}
                onChangeText={setSessionName}
            />

            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <FlatList
                data={exercises}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.exerciseItem}>
                        <Text style={styles.exerciseText}>{item.name} - {item.time}s, repos: {item.rest}s</Text>
                    </View>
                )}
                ListFooterComponent={
                    <TouchableOpacity
                        style={styles.addExerciseButton}
                        onPress={() => setIsModalVisible(true)}
                    >
                        <Text style={styles.addExerciseButtonText}>+</Text>
                    </TouchableOpacity>
                }
                style={styles.exerciseList}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveSession}>
                <FontAwesomeIcon icon={faSave} size={20}/>
            </TouchableOpacity>

            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Ajouter un exercice</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Exercice"
                            value={exerciseName}
                            onChangeText={setExerciseName}
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Durée (s)"
                            value={exerciseTime}
                            onChangeText={setExerciseTime}
                            keyboardType="numeric"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Repos (s)"
                            value={restTime}
                            onChangeText={setRestTime}
                            keyboardType="numeric"
                        />

                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={styles.modalButtonText}>Annuler</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton]}
                                onPress={addExercise}
                            >
                                <Text style={styles.modalButtonText}>Ajouter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const { width } = Dimensions.get('window');
const buttonSize = width * 0.15;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    addExerciseButton: {
        backgroundColor: '#28a745',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        marginBottom: 20,
    },
    addExerciseButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    exerciseList: {
        marginBottom: 20,
    },
    exerciseItem: {
        backgroundColor: '#e9ecef',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    exerciseText: {
        fontSize: 16,
    },
    saveButton: {
        backgroundColor: '#ececec',
        width: buttonSize, 
        height: buttonSize,
        borderRadius: buttonSize / 2, 
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#dc3545',
    },
    confirmButton: {
        backgroundColor: '#28a745',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
