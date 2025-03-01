// src/components/Cart.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Cart = ({ route }) => {
  const { cart } = route.params;
  const [cartItems, setCartItems] = useState(cart);
  const navigation = useNavigation();

  useEffect(() => {
    setCartItems(cart);
  }, [cart]);

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    Alert.alert('Sucesso', 'Produto removido do carrinho!');
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Erro', 'O carrinho está vazio');
      return;
    }
    navigation.navigate('Payment', { cart: cartItems });
  };

  return (
    <View style={styles.cartContainer}>
      <Text style={styles.title}>Carrinho de Compras</Text>
      {cartItems.length === 0 ? (
        <Text style={styles.emptyCart}>O carrinho está vazio</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDetails}>Quantidade: {item.quantity}</Text>
              <Text style={styles.productDetails}>Preço: R$ {item.price.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeFromCartButton}>Remover do carrinho</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
      <Button title="Ir para pagamento" onPress={handleCheckout} style={styles.checkoutButton} />
      <TouchableOpacity onPress={() => navigation.navigate('Store')}>
        <Text style={styles.addMoreProductsButton}>Adicionar mais produtos</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cartContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyCart: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
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
  },
  productDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  removeFromCartButton: {
    color: '#FF3B30',
    fontSize: 16,
  },
  checkoutButton: {
    marginBottom: 10,
  },
  addMoreProductsButton: {
    marginTop: 10,
    color: '#007AFF',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default Cart;