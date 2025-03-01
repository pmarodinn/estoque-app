// src/components/DeleteAccount.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase-config';
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';
import { db } from '../firebase-config';
import { doc, deleteDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const DeleteAccount = () => {
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleDeleteAccount = async () => {
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Excluir documentos do Firestore
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await deleteDoc(userDocRef);

      // Excluir a conta do usuário
      await deleteUser(auth.currentUser);
      Alert.alert('Sucesso', 'Conta excluída com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.deleteAccountContainer}>
      <Text style={styles.title}>Excluir Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Confirmar exclusão" onPress={handleDeleteAccount} style={styles.button} />
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.link}>Voltar ao dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  deleteAccountContainer: {
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

export default DeleteAccount;