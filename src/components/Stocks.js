// src/components/Stocks.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'stocks'));
        const stocksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStocks(stocksList);
      } catch (error) {
        console.error('Error fetching stocks:', error);
        Alert.alert('Erro', 'Não foi possível carregar os estoques.');
      }
    };

    fetchStocks();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Estoques</Text>
      <FlatList
        data={stocks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.stockItem}>
            <Text style={styles.stockName}>{item.name}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SelectedStock', { stockId: item.id })}>
              <Text style={styles.stockLink}>Acessar estoque</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button
        title="Adicionar novo estoque"
        onPress={() => navigation.navigate('ProductRegistration')}
      />
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
  stockItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockLink: {
    marginTop: 5,
    color: '#007AFF',
  },
});

export default Stocks;