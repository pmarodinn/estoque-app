import React from 'react';
import { LogBox } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './App';

// Ignorar warnings específicos (opcional)
LogBox.ignoreLogs(['Warning: ...']);

registerRootComponent(App);