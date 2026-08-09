import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, Image, ScrollView, Dimensions } from 'react-native';
import { BarChart, LineChart } from "react-native-gifted-charts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCrown, faXmark } from '@fortawesome/free-solid-svg-icons';

export default function ProfileIcon({ navigation }) {
    // Responsive design test
    const { height, width } = Dimensions.get('window');
    const actualDimensions = {
        height: height < width ? width : height,
        width: width > height ? height : width,
    };

    const [modalVisible, setModalVisible] = useState(false);
    const [iconSelectionVisible, setIconSelectionVisible] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(require('../../assets/images/profile_icons/woman.png'));
    const [userData, setUserData] = useState(null);
    const isFocused = useIsFocused(); // Détecte si l'écran est en focus

    const iconLibrary = [
        require('../../assets/images/profile_icons/woman.png'),
        require('../../assets/images/profile_icons/man.png'),
        require('../../assets/images/profile_icons/totoro.png'),
    ];

    const loadData = async () => {
        try {
            const savedData = await AsyncStorage.getItem('userProfile');
            if (savedData) setUserData(JSON.parse(savedData));
        } catch (error) {
            console.error("Erreur de chargement des données", error);
        }
    };

    useEffect(() => {
        if (isFocused) {
            loadData();
        }
    }, [isFocused]);

    const openProfile = () => setModalVisible(true);
    const closeProfile = () => setModalVisible(false);
    const openSuccess = () => setModalVisible(false);

    /* Test Chart */
    const data=[ {value:50}, {value:80}, {value:90}, {value:70} , {value:60}]
    /* See https://gifted-charts.web.app/ */


    return (
        <View style={{ position: 'absolute', top: 40, right: 20 }}>
            {/* Image de base */}
            <TouchableOpacity onPress={openProfile} style={{zIndex: 10}}>
                <Image
                    source={selectedIcon}
                    style={{ width: 50, height: 50, borderRadius: 30, backgroundColor: 'white' }}
                />
            </TouchableOpacity>

            {/* Modal principal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeProfile}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: width * 0.3, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        {/* Bouton pour fermer le modal */}
                        <TouchableOpacity onPress={closeProfile} style={{ alignSelf: 'flex-start' }}>
                            <FontAwesomeIcon icon={faXmark} size={40} color="black" />
                        </TouchableOpacity>

                           {/* Bouton pour ouvrir la sélection d'icônes */}
                        <TouchableOpacity onPress={() => setIconSelectionVisible(true)} 
                                                    style={{
                                                        
                                                        alignItems: 'center',
                                                    }}
                            >
                            <Image source={selectedIcon} style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#fafafa' }}/>
                        </TouchableOpacity>

                        {userData ? (
                            <>
                            <Text style={{ fontSize: 24, fontWeight: 'bold', textAlign: 'center'}}>
                                {userData.username}
                            </Text>
                            </>
                        ) : (
                            <Text>Aucun profil trouvé</Text>
                        )}

                        {data ? (
                            <>
                            <BarChart data = {data} />
                            <LineChart data = {data} />
                            </>
                        ) : (
                            <Text>Aucunes données trouvées</Text>
                        )}
                        <TouchableOpacity 
                            onPress={openSuccess} 
                            className="bg-yellow-400 self-center justify-center items-center p-2 rounded-lg w-48 h-16"
                        >
                            <FontAwesomeIcon icon={faCrown} size={40} color="#A38A00" />
                            <Text style={{ color: '#A38A00'}} className="font-bold text-center">SUCCESS</Text>

                        </TouchableOpacity>


                        

                        {/* Affichage des données utilisateur */}
                        {/*userData ? (
                            <>
                                <Text>Pseudo: {userData.username}</Text>
                                <Text>Genre: {userData.genre}</Text>
                                <Text>Âge: {userData.age}</Text>
                                <Text>Poids: {userData.poids} kg</Text>
                                <Text>Taille: {userData.taille} cm</Text>
                                <Text>Objectifs: {userData.goals.join(', ')}</Text>
                                <Text>Niveau: {userData.level}</Text>
                            </>
                        ) : (
                            <Text>Aucun profil trouvé</Text>
                        )*/}

                     
                    </View>
                </View>
            </Modal>

            {/* Modal pour sélectionner une icône */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={iconSelectionVisible}
                onRequestClose={() => setIconSelectionVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: width * 0.5, padding: 20, backgroundColor: 'white', borderRadius: 10 }}>
                        <TouchableOpacity
                            onPress={() => setIconSelectionVisible(false)}
                            style={{alignSelf: 'flex-start' }}
                        >
                            <FontAwesomeIcon icon={faXmark} size={40} color="black" />
                        </TouchableOpacity>

                        <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                            {iconLibrary.map((icon, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => {
                                        setSelectedIcon(icon);
                                        setIconSelectionVisible(false);
                                    }}
                                    style={{ margin: 10 }}
                                >
                                    <Image source={icon} style={{ width: 50, height: 50, borderRadius: 25 }} />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}
