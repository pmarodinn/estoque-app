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
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    if (existingProductIndex !== -1) {
      const updatedCart = cart.map((item, index) =>
        index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    Alert.alert('Sucesso', 'Produto adicionado ao carrinho!');
  };

  return (
    <View style={styles.storeContainer}>
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
            <Button
              title="Adicionar ao carrinho"
              onPress={() => addToCart(item)}
              color="#007AFF"
            />
          </View>
        )}
      />
      <Button
        title="Ir para carrinho"
        onPress={() => navigation.navigate('Cart', { cart })}
        color="#007AFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  storeContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  productItem: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  button: {
    marginBottom: 10,
  },
  goToCartButton: {
    marginTop: 20,
  },
});

export default Store;