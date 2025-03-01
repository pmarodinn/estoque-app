// src/components/Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../firebase-config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../firebase-config';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('Funcionário');
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

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
    <View style={styles.registerContainer}>
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
      <Button title="Cadastrar" onPress={handleRegister} style={styles.button} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Voltar ao login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
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
  button: {
    marginBottom: 10,
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});

export default Register;