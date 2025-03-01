// src/components/Payment.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Picker } from 'react-native';

const Payment = ({ route }) => {
  const { cart } = route.params;
  const [paymentMethod, setPaymentMethod] = useState('Cartão');
  const [address, setAddress] = useState('');
  const [recipientName, setRecipientName] = useState('');

  const handlePayment = () => {
    if (!address || !recipientName) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    // Aqui você pode adicionar a lógica de processamento de pagamento
    // Por exemplo, integrar com um gateway de pagamento

    Alert.alert('Sucesso', 'Compra finalizada com sucesso!');
    // Redirecionar para a tela inicial ou outra tela após o pagamento
  };

  return (
    <View style={styles.container}>
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
      <Button title="Finalizar compra" onPress={handlePayment} />
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
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 12,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});

export default Payment;