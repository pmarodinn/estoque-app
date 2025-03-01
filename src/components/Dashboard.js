// src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase-config';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const Dashboard = () => {
  const navigation = useNavigation();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      const docSnap = await getDoc(userDoc);
      if (docSnap.exists()) {
        setUserType(docSnap.data().userType);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.userName}>{auth.currentUser.email}</Text>
        <Text style={styles.userType}>{userType}</Text>
      </View>
      <View style={styles.sidebar}>
        <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
          <Text style={styles.sidebarLink}>Alterar senha</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('DeleteAccount')}>
          <Text style={styles.sidebarLink}>Excluir conta</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.mainContent}>
        <Button title="Ver estoques" onPress={() => navigation.navigate('Stocks')} />
        <Button title="Loja" onPress={() => navigation.navigate('Store')} />
        {userType === 'Administrador' && (
          <Button title="Adicionar novo estoque" onPress={() => navigation.navigate('ProductRegistration')} />
        )}
        <Button title="Sair" onPress={handleSignOut} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  userType: {
    fontSize: 16,
    color: '#555',
  },
  sidebar: {
    marginBottom: 20,
  },
  sidebarLink: {
    color: '#007AFF',
    marginBottom: 10,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Dashboard;