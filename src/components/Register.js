// src/components/Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { db } from '../firebase-config';
import { setDoc, doc } from 'firebase/firestore';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Funcionário');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Salvar informações adicionais no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
        userType: userType,
      });

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Usuário</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <View style={styles.userTypeContainer}>
        <Text>Tipo de usuário:</Text>
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            userType === 'Administrador' && styles.selectedUserTypeButton,
          ]}
          onPress={() => setUserType('Administrador')}
        >
          <Text
            style={[
              styles.userTypeButtonText,
              userType === 'Administrador' && styles.selectedUserTypeButtonText,
            ]}
          >
            Administrador
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.userTypeButton,
            userType === 'Funcionário' && styles.selectedUserTypeButton,
          ]}
          onPress={() => setUserType('Funcionário')}
        >
          <Text
            style={[
              styles.userTypeButtonText,
              userType === 'Funcionário' && styles.selectedUserTypeButtonText,
            ]}
          >
            Funcionário
          </Text>
        </TouchableOpacity>
      </View>
      <Button title="Cadastrar" onPress={handleRegister} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
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
  userTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userTypeButton: {
    marginHorizontal: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  selectedUserTypeButton: {
    backgroundColor: '#007AFF',
  },
  userTypeButtonText: {
    color: '#333',
  },
  selectedUserTypeButtonText: {
    color: '#fff',
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
  },
});

export default Register;