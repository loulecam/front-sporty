import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';
import InputWithIcons from './InputWithIcons';

export default function FriendChatPage({ route, navigation }) {
  const { item } = route.params; 
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rightHeader}>
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>⟵</Text>
          </TouchableOpacity>
          <Image source={{ uri: item?.avatar }} style={styles.avatar} />
          <Text style={styles.headerText}>{item?.name}</Text>
        </View>
        <TouchableOpacity>
          <FontAwesomeIcon icon={faDumbbell} size={24} color="#6200ea" />
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <Text style={styles.chatPlaceholder}>Start a conversation...</Text>
      </View>

      <InputWithIcons />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  back: {
    marginRight: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  chatPlaceholder: {
    fontSize: 16,
    color: '#aaa',
  },
});
