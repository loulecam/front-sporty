import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCamera, faMicrophone, faImage, faStickyNote } from '@fortawesome/free-solid-svg-icons';

export default function InputWithIcons() {
  return (
    <View style={styles.inputContainer}>
      {/* Icône caméra à gauche */}
      <TouchableOpacity style={styles.iconLeft}>
        <FontAwesomeIcon icon={faCamera} size={24} color="#6200ea" />
      </TouchableOpacity>

      {/* TextInput au centre */}
      <TextInput
        style={styles.input}
        placeholder="Type your message..."
        placeholderTextColor="#aaa"
      />

      {/* Icônes vocal, image et GIF à droite */}
      <View style={styles.iconsRight}>
        <TouchableOpacity style={styles.icon}>
          <FontAwesomeIcon icon={faMicrophone} size={24} color="#6200ea" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <FontAwesomeIcon icon={faImage} size={24} color="#6200ea" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon}>
          <FontAwesomeIcon icon={faStickyNote} size={24} color="#6200ea" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  iconLeft: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  iconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 5,
  },
});
