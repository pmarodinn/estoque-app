// src/components/QRCodeGeneration.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const QRCodeGeneration = () => {
  const [data, setData] = useState('');
  const [qrCode, setQRCode] = useState(null);
  const navigation = useNavigation();

  const generateQRCode = () => {
    if (!data) {
      Alert.alert('Erro', 'Por favor, insira os dados para gerar o QRCode.');
      return;
    }
    setQRCode(data);
  };

  const handleShareQRCode = async () => {
    if (!qrCode) {
      Alert.alert('Erro', 'Por favor, gere um QRCode primeiro.');
      return;
    }

    const svg = <QRCode value={qrCode} size={200} />;
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg">${svg.toDataURL()}</svg>`;
    const uri = `${FileSystem.cacheDirectory}qrcode.svg`;

    try {
      await FileSystem.writeAsStringAsync(uri, svgString, { encoding: FileSystem.EncodingType.UTF8 });
      await shareAsync(uri, { mimeType: 'image/svg+xml' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o QRCode');
    }
  };

  return (
    <View style={styles.qrcodeGenerationContainer}>
      <Text style={styles.title}>Geração de QRCode</Text>
      <TextInput
        style={styles.input}
        placeholder="Dados para o QRCode"
        value={data}
        onChangeText={setData}
        multiline
        numberOfLines={4}
      />
      <Button title="Gerar QRCode" onPress={generateQRCode} style={styles.button} />
      {qrCode && (
        <View style={styles.qrCodeContainer}>
          <QRCode value={qrCode} size={200} />
        </View>
      )}
      <Button title="Compartilhar QRCode" onPress={handleShareQRCode} style={styles.button} />
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Text style={styles.link}>Voltar ao dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  qrcodeGenerationContainer: {
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
    height: 80,
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
  qrCodeContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
});

export default QRCodeGeneration;