import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

const AmisList = [
  { id: '1', name: 'Alice', avatar: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Bob', avatar: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Charlie', avatar: 'https://via.placeholder.com/50' },
];

const GroupesList = [
  { id: '1', name: 'React Lovers', avatar: 'https://via.placeholder.com/50' },
  { id: '2', name: 'Fitness Friends', avatar: 'https://via.placeholder.com/50' },
  { id: '3', name: 'Book Club', avatar: 'https://via.placeholder.com/50' },
];

const ListeAmis = ({ onSelect }) => (
  <FlatList
    data={AmisList}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => onSelect(item)}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);

const ListeGroupes = ({ onSelect }) => (
  <FlatList
    data={GroupesList}
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <TouchableOpacity onPress={() => onSelect(item)}>
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
    )}
  />
);

export default function Communaute({ navigation }) {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'amis', title: 'Amis' },
    { key: 'groupes', title: 'Groupes' },
  ]);

  const handleSelect = (item) => {
    navigation.navigate('FriendChatPage', { item }); 
  };

  const renderScene = SceneMap({
    amis: () => <ListeAmis onSelect={handleSelect} />,
    groupes: () => <ListeGroupes onSelect={handleSelect} />,
  });

  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#000' }}
            style={{ backgroundColor: '#fff' }}
            activeColor="black"
            inactiveColor="grey"
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
  },
});
