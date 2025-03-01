// src/components/ProductWithdrawal.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db } from '../firebase-config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

const ProductWithdrawal = () => {
  const route = useRoute();
  const { productId, stockId } = route.params;
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [withdrawalDate, setWithdrawalDate] = useState('');
  const [currentQuantity, setCurrentQuantity] = useState(0);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, `stocks/${stockId}/products`, productId);
        const docSnap = await getDoc(productDoc);

        if (docSnap.exists()) {
          const productData = docSnap.data();
          setProductName(productData.name);
          setCurrentQuantity(productData.quantity);
        } else {
          Alert.alert('Erro', 'Produto não encontrado');
          navigation.navigate('SelectedStock', { stockId });
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('Erro', 'Não foi possível carregar o produto.');
        navigation.navigate('SelectedStock', { stockId });
      }
    };

    fetchProduct();
  }, [productId, stockId, navigation]);

  const handleWithdrawal = async () => {
    if (!quantity || !withdrawalDate) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    const withdrawalQuantity = parseInt(quantity, 10);

    if (withdrawalQuantity <= 0) {
      Alert.alert('Erro', 'A quantidade de retirada deve ser maior que zero');
      return;
    }

    if (withdrawalQuantity > currentQuantity) {
      Alert.alert('Erro', 'Quantidade de retirada maior que a disponível');
      return;
    }

    try {
      const productDocRef = doc(db, `stocks/${stockId}/products`, productId);
      await updateDoc(productDocRef, { quantity: currentQuantity - withdrawalQuantity });
      Alert.alert('Sucesso', 'Retirada realizada com sucesso!');
      navigation.navigate('SelectedStock', { stockId });
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.productWithdrawalContainer}>
      <Text style={styles.title}>Retirada de Produto</Text>
      <Text style={styles.productName}>Produto: {productName}</Text>
      <Text style={styles.productDetails}>Quantidade disponível: {currentQuantity}</Text>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Data de saída"
        value={withdrawalDate}
        onChangeText={setWithdrawalDate}
      />
      <Button title="Confirmar retirada" onPress={handleWithdrawal} style={styles.button} />
      <TouchableOpacity onPress={() => navigation.navigate('SelectedStock', { stockId })}>
        <Text style={styles.link}>Voltar ao estoque</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productWithdrawalContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  productDetails: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  button: {
    marginBottom: 10,
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});

export default ProductWithdrawal;