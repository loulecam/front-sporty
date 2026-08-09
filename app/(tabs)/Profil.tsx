import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function ProfileIcon() {
  const navigation = useNavigation(); // Accéder à la navigation

  const goToProfile = () => {
    navigation.navigate('Profil'); // Navigue vers l'écran "Profile"
  };

  return (
    <View style={{ position: 'absolute', top: 40, right: 20 }}>
      <TouchableOpacity onPress={goToProfile} style={{ zIndex: 10 }}>
        <Image
          source={require('../../assets/images/profile_icons/woman.png')} // Icône par défaut
          style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: 'white' }}
        />
      </TouchableOpacity>
    </View>
  );
}
