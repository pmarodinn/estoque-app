// src/components/Store.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Store = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
    Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loja</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>Quantidade: {item.quantity}</Text>
            <Text style={styles.productDetails}>Preço: R$ {item.price.toFixed(2)}</Text>
            <Text style={styles.productDetails}>Descrição: {item.description}</Text>
            <Button title="Adicionar ao carrinho" onPress={() => addToCart(item)} />
          </View>
        )}
      />
      <Button title="Ir para carrinho" onPress={() => navigation.navigate('Cart', { cart })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  productItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productDetails: {
    fontSize: 16,
    color: '#555',
  },
});

export default Store;