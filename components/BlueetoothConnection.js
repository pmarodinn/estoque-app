// src/components/BluetoothConnection.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const bleManager = new BleManager();

const BluetoothConnection = () => {
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    const subscription = bleManager.onStateChange((state) => {
      if (state === 'PoweredOn') {
        if (!scanning) {
          scanForDevices();
        }
      }
    }, true);

    return () => {
      subscription.remove();
    };
  }, [scanning]);

  const scanForDevices = () => {
    setScanning(true);
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Error scanning devices:', error);
        Alert.alert('Erro', 'Erro ao escanear dispositivos Bluetooth');
        setScanning(false);
        return;
      }

      if (device.name) {
        setDevices((prevDevices) => {
          const existingDevice = prevDevices.find(d => d.id === device.id);
          if (!existingDevice) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });
  };

  const stopScanning = () => {
    bleManager.stopDeviceScan();
    setScanning(false);
  };

  const connectToDevice = (device) => {
    bleManager.connectToDevice(device.id)
      .then(device => device.discoverAllServicesAndCharacteristics())
      .then(device => {
        setConnectedDevice(device);
        Alert.alert('Sucesso', `Conectado a ${device.name}`);
      })
      .catch(error => {
        console.error('Error connecting to device:', error);
        Alert.alert('Erro', 'Erro ao conectar ao dispositivo');
      });
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id)
        .then(() => {
          setConnectedDevice(null);
          Alert.alert('Sucesso', 'Desconectado do dispositivo');
        })
        .catch(error => {
          console.error('Error disconnecting from device:', error);
          Alert.alert('Erro', 'Erro ao desconectar do dispositivo');
        });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conexão Bluetooth com Impressora</Text>
      <Button
        title={scanning ? "Parar Escaneamento" : "Escanear Dispositivos"}
        onPress={scanning ? stopScanning : scanForDevices}
      />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.deviceItem}>
            <Text style={styles.deviceName}>{item.name || 'Dispositivo sem nome'}</Text>
            <TouchableOpacity onPress={() => connectToDevice(item)}>
              <Text style={styles.connectLink}>Conectar</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      {connectedDevice && (
        <View style={styles.connectedDevice}>
          <Text style={styles.connectedDeviceText}>Conectado a: {connectedDevice.name}</Text>
          <TouchableOpacity onPress={disconnectFromDevice}>
            <Text style={styles.disconnectLink}>Desconectar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  deviceItem: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deviceName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  connectLink: {
    color: '#007AFF',
    fontSize: 16,
  },
  connectedDevice: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#e0f7fa',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#b2ebf2',
    alignItems: 'center',
  },
  connectedDeviceText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  disconnectLink: {
    color: '#FF3B30',
    fontSize: 16,
  },
});

export default BluetoothConnection;