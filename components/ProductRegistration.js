// src/components/ProductRegistration.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import QRCode from 'react-native-qrcode-svg';
import * as ImagePicker from 'expo-image-picker';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

const ProductRegistration = () => {
  const route = useRoute();
  const { stockId } = route.params;
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [location, setLocation] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const navigation = useNavigation();

  const handleSaveProduct = async () => {
    if (!name || !quantity || !location || !arrivalDate || !description || !photo) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    try {
      const productData = {
        name,
        quantity: parseInt(quantity, 10),
        location,
        arrivalDate,
        description,
        photo,
      };

      await addDoc(collection(db, `stocks/${stockId}/products`), productData);
      Alert.alert('Sucesso', 'Produto cadastrado com sucesso!');
      navigation.navigate('SelectedStock', { stockId });
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const generateQRCode = () => {
    const qrCodeData = JSON.stringify({
      name,
      quantity: parseInt(quantity, 10),
      location,
      arrivalDate,
      description,
      photo,
    });

    return <QRCode value={qrCodeData} size={200} />;
  };

  const handleShareQRCode = async () => {
    const qrCodeData = JSON.stringify({
      name,
      quantity: parseInt(quantity, 10),
      location,
      arrivalDate,
      description,
      photo,
    });

    const svg = generateQRCode();
    const svgString = `<svg xmlns="http://www.w3.org/2000/svg">${svg.toDataURL()}</svg>`;
    const uri = `${FileSystem.cacheDirectory}qrcode.svg`;

    try {
      await FileSystem.writeAsStringAsync(uri, svgString, { encoding: FileSystem.EncodingType.UTF8 });
      await Sharing.shareAsync(uri, { mimeType: 'image/svg+xml' });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível compartilhar o QRCode');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.productRegistrationContainer}>
      <Text style={styles.title}>Cadastro de Produto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Localização do setor"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Data de chegada"
        value={arrivalDate}
        onChangeText={setArrivalDate}
      />
      <TextInput
        style={styles.multilineInput}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload de Foto</Text>
      </TouchableOpacity>
      {photo && (
        <Image source={{ uri: photo }} style={styles.photo} />
      )}
      <Button title="Gerar QRCode" onPress={handleShareQRCode} style={styles.button} />
      <Button title="Salvar" onPress={handleSaveProduct} style={styles.button} />
      <TouchableOpacity onPress={() => navigation.navigate('SelectedStock', { stockId })}>
        <Text style={styles.link}>Voltar ao estoque</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productRegistrationContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
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
  multilineInput: {
    height: 80,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  uploadButton: {
    width: '80%',
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
  },
  photo: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  button: {
    marginBottom: 10,
  },
  link: {
    marginTop: 10,
    color: '#007AFF',
    fontSize: 16,
  },
  qrCodeContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
});

export default ProductRegistration;