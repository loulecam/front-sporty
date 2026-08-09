import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faX, faPlus} from '@fortawesome/free-solid-svg-icons';



export default function StartTraining({ navigation }) {
    const [routines, setRoutines] = useState([]);
    const [selectedRoutine, setSelectedRoutine] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    // Fonction pour charger les séances sauvegardées
    const loadRoutines = async () => {
        try {
            const files = await FileSystem.readDirectoryAsync(FileSystem.documentDirectory);
            const sessionFiles = files.filter(file => file.endsWith('.json'));
    
            const loadedRoutines = await Promise.all(
                sessionFiles.map(async (file) => {
                    try {
                        const content = await FileSystem.readAsStringAsync(`${FileSystem.documentDirectory}${file}`);
                        const parsedContent = JSON.parse(content);
    
                        if (parsedContent.name && parsedContent.exercises) {
                            return { ...parsedContent, fileName: file };
                        }
                    } catch (error) {
                        console.warn(`Fichier ignoré (non valide) : ${file}`);
                    }
                    return null; 
                })
            );
    
            // Enleve les routine null 
            setRoutines(loadedRoutines.filter(routine => routine !== null));
        } catch (error) {
            console.error('Erreur lors du chargement des séances :', error);
        }
    };
    

    useFocusEffect(
        React.useCallback(() => {
            loadRoutines();
        }, [])
    );

    const deleteRoutine = async (fileName) => {
        try {
            await FileSystem.deleteAsync(`${FileSystem.documentDirectory}${fileName}`);
            loadRoutines(); 
        } catch (error) {
            console.error('Erreur lors de la suppression de la séance :', error);
        }
    };

    const openModal = (routine) => {
        setSelectedRoutine(routine);
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setSelectedRoutine(null);
        setIsModalVisible(false);
    };

    const startActivity = () => {
        closeModal();
        navigation.navigate('TrainingScreen', { routine: selectedRoutine });
    };

    const addRoutine = () => {
        navigation.navigate('ExploreRoutine');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Séances sauvegardées</Text>

            <FlatList
                data={routines}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <TouchableOpacity style={styles.listItemContent} onPress={() => openModal(item)}>
                            <View>
                                <Text style={styles.listItemText}>{item.name}</Text>
                                <Text style={styles.listDescription}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => deleteRoutine(item.fileName)}>
                            <FontAwesomeIcon icon={faX} />
                        </TouchableOpacity>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />

            {selectedRoutine && (
                <Modal
                    visible={isModalVisible}
                    animationType="slide"
                    transparent
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedRoutine.name}</Text>

                            <ScrollView style={styles.scrollContainer}>
                                <Text style={styles.modalDescription}>
                                    {selectedRoutine.description}
                                </Text>

                                <Text style={styles.modalSectionTitle}>Exercices :</Text>
                                {selectedRoutine.exercises.map((exercise, index) => (
                                    <View key={index} style={styles.exerciseItem}>
                                        <Text style={styles.exerciseText}>
                                            {index + 1}. {exercise.name} - {exercise.time}s, Repos: {exercise.rest}s
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>

                            <View style={styles.modalButtonsContainer}>
                                <TouchableOpacity style={[styles.modalButton, styles.closeButton]} onPress={closeModal}>
                                    <Text style={styles.modalButtonText}>Fermer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.modalButton, styles.startButton]} onPress={startActivity}>
                                    <Text style={styles.modalButtonText}>Démarrer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            <TouchableOpacity style={styles.addRoutineButton} onPress={addRoutine}>
                <FontAwesomeIcon icon={faPlus} size={25} />
            </TouchableOpacity>
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
    listContainer: {
        width: '100%',
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#e5e7eb',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 10,
        borderRadius: 10,
    },
    listItemContent: {
        flex: 1,
    },
    listItemText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    listDescription: {
        fontSize: 14,
        color: '#555',
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
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    scrollContainer: {
        marginBottom: 20,
    },
    modalDescription: {
        fontSize: 16,
        marginBottom: 20,
    },
    modalSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    exerciseItem: {
        marginBottom: 10,
    },
    exerciseText: {
        fontSize: 16,
        color: '#333',
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    modalButton: {
        flex: 1,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    closeButton: {
        backgroundColor: '#dc3545',
    },
    startButton: {
        backgroundColor: '#28a745',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addRoutineButton: {
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
});
