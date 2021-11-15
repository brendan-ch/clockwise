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
import ActionButtonBar from './src/components/ActionButtonBar';
import PageButtonBar from './src/components/PageButtonBar';
import TextStyles from './src/styles/Text';

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

  /**
   * Handle switching between break and focus modes.
   */
  // function handleStateSwitch(mode: 'focus' | 'break') {
  // }

  return (
    <View style={styles.container}>
      <Text style={TextStyles.textRegular}>Open up App.tsx to start working on your app!</Text>
      <PageButtonBar
        selected="focus"
        style={styles.pageButtonBar}
        // onPressFocus={() => handleStateSwitch('focus')}
        // onPressBreak={() => handleStateSwitch('break')}
      />
      <ActionButtonBar
        style={styles.actionButtonBar}
        text="The quick brown fox jumps over the lazy dog."
        state="stopped"
      />
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
  pageButtonBar: {
    height: 31,
    width: 268,
  },
  actionButtonBar: {
    height: 134,
    width: 268,
  },
});
