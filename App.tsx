import React from 'react';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'react-native';
import { Routes } from './src/routes';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

import theme from './src/global/styles/theme';
import { AppRoutes } from './src/routes/appRoutes';
import { AuthProvider } from './src/hooks/auth';
import { SignIn } from './src/screens/SignIn';


export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded){
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle='light-content' />
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  )
}
