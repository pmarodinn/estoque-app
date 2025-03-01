// src/components/ProductWithdrawal.js
import React, { useState } from 'react';
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
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productDoc = doc(db, `stocks/${stockId}/products`, productId);
        const docSnap = await getDoc(productDoc);
        if (docSnap.exists()) {
          setProductName(docSnap.data().name);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        Alert.alert('Erro', 'Não foi possível carregar o produto.');
      }
    };

    fetchProduct();
  }, [productId, stockId]);

  const handleWithdrawal = async () => {
    if (!quantity || !withdrawalDate) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      const productDocRef = doc(db, `stocks/${stockId}/products`, productId);
      const productDoc = await getDoc(productDocRef);

      if (productDoc.exists()) {
        const currentQuantity = productDoc.data().quantity;
        const withdrawalQuantity = parseInt(quantity, 10);

        if (withdrawalQuantity > currentQuantity) {
          Alert.alert('Erro', 'Quantidade de retirada maior que a disponível');
          return;
        }

        await updateDoc(productDocRef, { quantity: currentQuantity - withdrawalQuantity });
        Alert.alert('Sucesso', 'Retirada realizada com sucesso!');
        navigation.navigate('SelectedStock', { stockId });
      } else {
        Alert.alert('Erro', 'Produto não encontrado');
      }
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Retirada de Produto</Text>
      <Text style={styles.productName}>Produto: {productName}</Text>
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
      <Button title="Confirmar retirada" onPress={handleWithdrawal} />
      <TouchableOpacity onPress={() => navigation.navigate('SelectedStock', { stockId })}>
        <Text style={styles.link}>Voltar ao estoque</Text>
      </TouchableOpacity>
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
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
  },
});

export default ProductWithdrawal;