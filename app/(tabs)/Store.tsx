import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';
import battlepassImage from '../../assets/images/shop/battlepass.webp';


const Boutique = () => {
  const availableEclairs = 1500; // Nombre d'éclairs disponibles

  // Articles par rubrique
  const items = {
    Vetements: {
      Hauts: [
        { id: 1, name: 'T-Shirt', price: 100, image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Chemise', price: 150, image: 'https://via.placeholder.com/100' },
        { id: 3, name: 'Pull', price: 200, image: 'https://via.placeholder.com/100' },
      ],
      Pantalons: [
        { id: 1, name: 'Jean', price: 200, image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Jogging', price: 120, image: 'https://via.placeholder.com/100' },
      ],
      Chaussures: [
        { id: 1, name: 'Baskets', price: 250, image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Bottes', price: 300, image: 'https://via.placeholder.com/100' },
        { id: 3, name: 'Sandales', price: 100, image: 'https://via.placeholder.com/100' },
      ],
      Accessoires: [
        { id: 1, name: 'Casquette', price: 50, image: 'https://via.placeholder.com/100' },
        { id: 2, name: 'Montre', price: 400, image: 'https://via.placeholder.com/100' },
      ],
    },
    Coffres: [
      { id: 1, name: 'Petit Coffre', price: 50, image: 'https://via.placeholder.com/100' },
      { id: 2, name: 'Grand Coffre', price: 150, image: 'https://via.placeholder.com/100' },
    ],
  };

  const handlePurchase = (itemName, price) => {
    alert(`Vous avez acheté ${itemName} pour ${price} éclairs !`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header avec titre et compteur d'éclairs */}
      <View style={styles.header}>
        <Text style={styles.title}>Boutique</Text>
        <View style={styles.eclairsContainer}>
          <Text style={styles.eclairsText}>⚡ {availableEclairs}</Text>
          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Bloc Battle Pass */}
      <View style={styles.battlePassContainer}>
        <Image
          source={battlepassImage}
          style={styles.battlePassImage}
        />
        <TouchableOpacity
          style={styles.purchaseButton}
          onPress={() => handlePurchase('Battle Pass', 500)}
        >
          <Text style={styles.purchaseButtonText}>Acheter pour 500 ⚡</Text>
        </TouchableOpacity>
      </View>

      {/* Bloc Vêtements */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Vêtements</Text>
        {Object.keys(items.Vetements).map((subCategory) => (
          <View key={subCategory} style={styles.subBlock}>
            <Text style={styles.subtitle}>{subCategory}</Text>
            <ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
              {items.Vetements[subCategory].map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  <Image source={{ uri: item.image }} style={styles.itemImage} />
                  <TouchableOpacity
                    style={styles.purchaseButton}
                    onPress={() => handlePurchase(item.name, item.price)}
                  >
                    <Text style={styles.purchaseButtonText}>{item.price} ⚡</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        ))}
      </View>

      {/* Bloc Coffres */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Coffres</Text>
        <ScrollView horizontal contentContainerStyle={styles.horizontalScroll}>
          {items.Coffres.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <TouchableOpacity
                style={styles.purchaseButton}
                onPress={() => handlePurchase(item.name, item.price)}
              >
                <Text style={styles.purchaseButtonText}>{item.price} ⚡</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  eclairsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eclairsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  buyButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  block: {
    marginBottom: 30,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  blockTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subBlock: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  horizontalScroll: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemCard: {
    width: 120,
    height: 160,
    backgroundColor: '#e8e8e8',
    borderRadius: 8,
    marginHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  purchaseButton: {
    backgroundColor: '#FFD700',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  battlePassContainer: {
    marginBottom: 20,
  },
  battlePassImage: {
    width: '100%',
    height: 200,
  },
});

export default Boutique;
