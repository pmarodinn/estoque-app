// src/components/QRCodeGeneration.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const QRCodeGeneration = () => {
  const [data, setData] = useState('');
  const [qrCode, setQRCode] = useState(null);

  const generateQRCode = () => {
    if (!data) {
      alert('Por favor, insira os dados para gerar o QRCode.');
      return;
    }
    setQRCode(data);
  };

  const handleShareQRCode = async () => {
    if (!qrCode) {
      alert('Por favor, gere um QRCode primeiro.');
      return;
    }

    const svg = <QRCode value={qrCode} size={200} />;
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg">${svg.toDataURL()}</svg>`;
    const uri = `${FileSystem.cacheDirectory}qrcode.svg`;

    try {
      await FileSystem.writeAsStringAsync(uri, svgString, { encoding: FileSystem.EncodingType.UTF8 });
      await shareAsync(uri, { mimeType: 'image/svg+xml' });
    } catch (error) {
      alert('Não foi possível compartilhar o QRCode');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Geração de QRCode</Text>
      <TextInput
        style={styles.input}
        placeholder="Dados para o QRCode"
        value={data}
        onChangeText={setData}
        multiline
        numberOfLines={4}
      />
      <Button title="Gerar QRCode" onPress={generateQRCode} />
      {qrCode && (
        <View style={styles.qrCodeContainer}>
          <QRCode value={qrCode} size={200} />
        </View>
      )}
      <Button title="Compartilhar QRCode" onPress={handleShareQRCode} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 80,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    textAlignVertical: 'top',
  },
  qrCodeContainer: {
    marginVertical: 20,
  },
});

export default QRCodeGeneration;