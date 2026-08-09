import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import CameraScreen from './Camera';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faVideoCamera, faX } from '@fortawesome/free-solid-svg-icons';

export default function TrainingScreen({ route, navigation }) {
    const { routine } = route.params;

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [globalTime, setGlobalTime] = useState(0); // Timer global
    const [exerciseTime, setExerciseTime] = useState(0); // Timer pour chaque exercice
    const [isPaused, setIsPaused] = useState(false);
    const [isResting, setIsResting] = useState(false); // Indique si on est en pause
    const [restTime, setRestTime] = useState(0); // Timer de pause
    const [repetitions, setRepetitions] = useState(0);
    const [cameraUsed, enableCamera] = useState(false);

    const currentExercise = routine.exercises[currentExerciseIndex];
    const nextExercise =
        currentExerciseIndex < routine.exercises.length - 1
            ? routine.exercises[currentExerciseIndex + 1]
            : null;
    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: 'none' } });
        return () => {
            navigation.getParent()?.setOptions({
            tabBarStyle: {
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#ffffff',
                borderTopWidth: 0.5,
                borderTopColor: '#d1d1d1',
                height: 60,
                shadowColor: '#000',
                elevation: 10,
                shadowOpacity: 0.1,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: -2 },
            },
            });
        };
    }, [navigation]);
    // Timer global
    useEffect(() => {
        let timer;
        if (!isPaused && !isResting) {
            timer = setInterval(() => {
                setGlobalTime((prev) => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isPaused, isResting]);

    // Timer pour l'exercice courant
    useEffect(() => {
        let exerciseTimer;
        if (!isPaused && !isResting && currentExercise) {
            exerciseTimer = setInterval(() => {
                setExerciseTime((prev) => {
                    if (prev > 0) {
                        return prev - 1;
                    } else {
                        clearInterval(exerciseTimer);
                        startRest(); // Lance la pause
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(exerciseTimer);
    }, [isPaused, isResting, currentExerciseIndex]);

    // Timer pour la pause
    useEffect(() => {
        let restTimer;
        if (isResting && !isPaused) {
            restTimer = setInterval(() => {
                setRestTime((prev) => {
                    if (prev > 0) {
                        return prev - 1;
                    } else {
                        clearInterval(restTimer);
                        handleNextExercise(); // Passe automatiquement à l'exercice suivant
                        return 0;
                    }
                });
            }, 1000);
        }
        return () => clearInterval(restTimer);
    }, [isResting, isPaused]);

    // Initialiser le timer avec la durée de l'exercice courant
    useEffect(() => {
        if (currentExercise) {
            setExerciseTime(Number(currentExercise.time)); // Initialise le timer
        }
    }, [currentExerciseIndex]);

    const startRest = () => {
        setIsResting(true);
        setRestTime(Number(currentExercise.rest)); // Initialise le timer de pause
    };

    const handleNextExercise = () => {
        if (currentExerciseIndex < routine.exercises.length - 1) {
            setCurrentExerciseIndex((prev) => prev + 1);
            setExerciseTime(Number(routine.exercises[currentExerciseIndex + 1].time)); // Durée du prochain exercice
            setIsResting(false);
            setRepetitions(0);
        } else {
            alert('Entraînement terminé !');
            navigation.navigate('StartTraining');
        }
    };

    const handleSkipRest = () => {
        setIsResting(false);
        handleNextExercise(); // Passe immédiatement à l'exercice suivant
    };

    const handlePreviousExercise = () => {
        if (currentExerciseIndex > 0) {
            setCurrentExerciseIndex((prev) => prev - 1);
            setExerciseTime(0);
            setIsResting(false);
            setRepetitions(0);
        }
    };

    const togglePause = () => {
        setIsPaused((prev) => !prev);
    };

    const activateCamera = () => {
        enableCamera((prev) => !prev);
    }

    // Ajoute 20 secondes à la pause
    const addRestTime = () => {
        setRestTime((prev) => prev + 20);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>⟵</Text>
                </TouchableOpacity>
                <Text style={styles.exerciseInfo}>
                    Exercice {currentExerciseIndex + 1}/{routine.exercises.length}
                </Text>
                <Text style={styles.globalTimer}>
                    Temps total : {Math.floor(globalTime / 60)}:{(globalTime % 60).toString().padStart(2, '0')}
                </Text>
                {!isResting && (
                    <TouchableOpacity onPress={activateCamera}>
                    <FontAwesomeIcon icon={cameraUsed ?  faX : faVideoCamera} /> 
                    </TouchableOpacity>
                )}
            </View>

            {isResting ? (
                <View style={styles.infoContainer}>
                    <Text style={styles.exerciseName}>Pause</Text>
                    <Text style={styles.exerciseTimer}>
                        Reprise dans : {Math.floor(restTime / 60)}:{(restTime % 60).toString().padStart(2, '0')}
                    </Text>
                </View>
            ) : (
                <>  
                {cameraUsed ? (
                    <CameraScreen />
                ) : (
                    <View style={styles.visualContainer}>
                        <Image
                            source={{ uri: currentExercise.image || 'https://via.placeholder.com/300' }}
                            style={styles.visual}
                        />
                    </View>
                )
                }
                    
                    <View style={[styles.infoContainer, styles.upper]}>
                        <Text style={styles.exerciseName}>{currentExercise.name}</Text>
                        <Text style={styles.exerciseTimer}>
                            Timer : {Math.floor(exerciseTime / 60)}:{(exerciseTime % 60).toString().padStart(2, '0')}
                        </Text>
                        <Text style={styles.repetitions}>Répétitions : {repetitions}</Text>
                    </View>
                </>
            )}

            {nextExercise && (
                <Text style={[styles.nextExerciseText , styles.upper]}>
                    Prochain exercice : {nextExercise.name}
                </Text>
            )}
            

            <View style={[styles.pauseAndAddTime , styles.upper]}>
                <TouchableOpacity style={styles.pauseButton} onPress={togglePause}>
                    <Text style={styles.pauseButtonText}>{isPaused ? 'Reprendre' : 'Pause'}</Text>
                </TouchableOpacity>
                {isResting && (
                    <TouchableOpacity style={styles.addTimeButton} onPress={addRestTime}>
                        <Text style={styles.addTimeButtonText}>+20s</Text>
                    </TouchableOpacity>
                )}
            </View>

            <View style={[styles.navigationButtons , styles.upper]}>
                <TouchableOpacity
                    style={[styles.navButton, styles.previousButton]}
                    onPress={handlePreviousExercise}
                >
                    <Text style={styles.navButtonText}>Précédent</Text>
                </TouchableOpacity>
                {isResting && (
                    <TouchableOpacity style={styles.skipButton} onPress={handleSkipRest}>
                        <Text style={styles.skipButtonText}>Passer la pause</Text>
                    </TouchableOpacity>
                )}
                {!isResting && (
                    <View>
                        <TouchableOpacity
                            style={[styles.navButton, styles.nextButton]}
                            onPress={handleNextExercise}
                        >
                            <Text style={styles.navButtonText}>Passer</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    exerciseInfo: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    globalTimer: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    visualContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    backButtonText: {
        fontSize: 24,
        color: '#000',
      },
    back: {
        
        marginRight: 20,
    },
    visual: {
        width: 300,
        height: 200,
        borderRadius: 10,
        backgroundColor: '#dcdcdc',
    },
   
    infoContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    exerciseName: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    exerciseTimer: {
        fontSize: 20,
        marginTop: 10,
    },
    repetitions: {
        fontSize: 18,
        marginTop: 10,
    },
    nextExerciseText: {
        fontSize: 18,
        fontStyle: 'italic',
        textAlign: 'center',
        marginVertical: 20,
    },
    pauseAndAddTime: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
    },
    pauseButton: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 3,
        marginHorizontal: 5,
    },
    pauseButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    addTimeButton: {
        backgroundColor: '#17a2b8',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    addTimeButtonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    navigationButtons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
    },
    navButton: {
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    previousButton: {
        backgroundColor: '#6c757d',
    },
    nextButton: {
        backgroundColor: '#007bff',
    },
    navButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButton: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 5,
    },
    skipButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
