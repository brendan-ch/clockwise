import {
  useFonts,
  /* eslint-disable camelcase */
  AnonymousPro_400Regular,
  AnonymousPro_400Regular_Italic,
  AnonymousPro_700Bold,
  AnonymousPro_700Bold_Italic,
} from '@expo-google-fonts/anonymous-pro';
import AppLoading from 'expo-app-loading';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    AnonymousPro_400Regular,
    AnonymousPro_400Regular_Italic,
    AnonymousPro_700Bold,
    AnonymousPro_700Bold_Italic,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
