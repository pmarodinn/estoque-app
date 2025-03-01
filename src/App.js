import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './components/Login';
import Register from './components/Register';
import RecoverPassword from './components/RecoverPassword';
import Dashboard from './components/Dashboard';
import ChangePassword from './components/ChangePassword';
import DeleteAccount from './components/DeleteAccount';
import Stocks from './components/Stocks';
import SelectedStock from './components/SelectedStock';
import ProductRegistration from './components/ProductRegistration';
import ProductWithdrawal from './components/ProductWithdrawal';
import Store from './components/Store';
import Cart from './components/Cart';
import Payment from './components/Payment';
import BluetoothConnection from './components/BluetoothConnection';
import QRCodeGeneration from './components/QRCodeGeneration';
import DataExport from './components/DataExport';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} />
      <Tab.Screen name="Stocks" component={Stocks} options={{ headerShown: false }} />
      <Tab.Screen name="Store" component={Store} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="RecoverPassword" component={RecoverPassword} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeAsTabs} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
        <Stack.Screen name="SelectedStock" component={SelectedStock} />
        <Stack.Screen name="ProductRegistration" component={ProductRegistration} />
        <Stack.Screen name="ProductWithdrawal" component={ProductWithdrawal} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="BluetoothConnection" component={BluetoothConnection} />
        <Stack.Screen name="QRCodeGeneration" component={QRCodeGeneration} />
        <Stack.Screen name="DataExport" component={DataExport} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}