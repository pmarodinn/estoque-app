// src/components/SelectedStock.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase-config';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const SelectedStock = () => {
  const route = useRoute();
  const { stockId } = route.params;
  const [products, setProducts] = useState([]);
  const navigation = useNavigation();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, `stocks/${stockId}/products`));
        const productsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProducts(productsList);
      } catch (error) {
        console.error('Error fetching products:', error);
        Alert.alert('Erro', 'Não foi possível carregar os produtos.');
      }
    };

    const fetchUserInfo = async () => {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUserType(docSnap.data().userType);
      }
    };

    fetchProducts();
    fetchUserInfo();
  }, [stockId]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, `stocks/${stockId}/products`, productId));
      Alert.alert('Sucesso', 'Produto excluído com sucesso!');
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleAddQuantity = async (productId, currentQuantity) => {
    try {
      const productDocRef = doc(db, `stocks/${stockId}/products`, productId);
      await updateDoc(productDocRef, { quantity: currentQuantity + 1 });
      Alert.alert('Sucesso', 'Quantidade atualizada com sucesso!');
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleRemoveQuantity = async (productId, currentQuantity) => {
    if (currentQuantity <= 0) {
      Alert.alert('Erro', 'A quantidade não pode ser menor que zero.');
      return;
    }
    try {
      const productDocRef = doc(db, `stocks/${stockId}/products`, productId);
      await updateDoc(productDocRef, { quantity: currentQuantity - 1 });
      Alert.alert('Sucesso', 'Quantidade atualizada com sucesso!');
      fetchProducts();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoque Selecionado</Text>
      <FlatList
        data={products}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productDetails}>Quantidade: {item.quantity}</Text>
            <Text style={styles.productDetails}>Localização: {item.location}</Text>
            <Text style={styles.productDetails}>Data de chegada: {item.arrivalDate}</Text>
            <Text style={styles.productDetails}>Descrição: {item.description}</Text>
            <View style={styles.buttonContainer}>
              <Button title="Excluir" onPress={() => handleDeleteProduct(item.id)} />
              <Button title="+" onPress={() => handleAddQuantity(item.id, item.quantity)} />
              <Button title="-" onPress={() => handleRemoveQuantity(item.id, item.quantity)} />
            </View>
          </View>
        )}
      />
      {userType === 'Administrador' && (
        <Button
          title="Adicionar novo produto"
          onPress={() => navigation.navigate('ProductRegistration', { stockId })}
        />
      )}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default SelectedStock;