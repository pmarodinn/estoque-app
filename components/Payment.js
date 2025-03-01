// src/components/Payment.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const Payment = () => {
  const route = useRoute();
  const { cart } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('Cartão');
  const [address, setAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const navigation = useNavigation();

  const handlePayment = () => {
    if (!address || !recipientName) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    // Aqui você pode adicionar a lógica de processamento de pagamento
    // Por exemplo, integrar com um gateway de pagamento

    Alert.alert('Sucesso', 'Compra finalizada com sucesso!');
    navigation.navigate('Dashboard'); // Redirecionar para a tela inicial ou outra tela após o pagamento
  };

  return (
    <View style={styles.paymentContainer}>
      <Text style={styles.title}>Pagamento</Text>
      <Picker
        selectedValue={paymentMethod}
        onValueChange={(itemValue) => setPaymentMethod(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Cartão (crédito/débito)" value="Cartão" />
        <Picker.Item label="Pix" value="Pix" />
        <Picker.Item label="Boleto" value="Boleto" />
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Endereço (rua, número, complemento, bairro, cidade, estado, CEP)"
        value={address}
        onChangeText={setAddress}
        multiline
        numberOfLines={4}
      />
      <TextInput
        style={styles.input}
        placeholder="Nome do destinatário"
        value={recipientName}
        onChangeText={setRecipientName}
      />
      <Button title="Finalizar compra" onPress={handlePayment} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  paymentContainer: {
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
  picker: {
    height: 50,
    width: '80%',
    marginBottom: 12,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  button: {
    marginBottom: 10,
  },
});

export default Payment;