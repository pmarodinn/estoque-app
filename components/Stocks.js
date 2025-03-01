// src/components/Stocks.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebase-config';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const Stocks = () => {
  const [stocks, setStocks] = useState([]);
  const [userType, setUserType] = useState('');
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

    const fetchUserInfo = async () => {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUserType(docSnap.data().userType);
      }
    };

    fetchStocks();
    fetchUserInfo();
  }, []);

  return (
    <View style={styles.stocksContainer}>
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
      {userType === 'Administrador' && (
        <Button
          title="Adicionar novo estoque"
          onPress={() => navigation.navigate('ProductRegistration')}
          color="#007AFF"
        />
      )}
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.backButton}>Voltar ao dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  stocksContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  stockItem: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stockName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  stockLink: {
    color: '#007AFF',
    fontSize: 16,
  },
  backButton: {
    marginTop: 20,
    color: '#007AFF',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Stocks;