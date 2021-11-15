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
import {
  StyleSheet, View, useWindowDimensions, Text,
} from 'react-native';
import ActionButtonBar from './src/components/ActionButtonBar';
import PageButtonBar from './src/components/PageButtonBar';
import Timer from './src/components/Timer';

export default function App() {
  const [fontsLoaded] = useFonts({
    AnonymousPro_400Regular,
    AnonymousPro_400Regular_Italic,
    AnonymousPro_700Bold,
    AnonymousPro_700Bold_Italic,
  });

  const { height, width } = useWindowDimensions();

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  /**
   * Handle switching between break and focus modes.
   */
  // function handleStateSwitch(mode: 'focus' | 'break') {
  // }

  // console.log(height);
  // console.log(width);

  // Set breakpoints
  // Small window view
  if (height < 400 && width < 700) {
    // Center everything
    return (
      <View style={styles.container}>
        <Timer
          display="25:00"
          style={styles.timer}
        />
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

  // Landscape view
  if (width >= 700) {
    // Display timer and tasks side by side
    return (
      <View style={styles.container}>
        <View style={styles.contentContainerLandscape}>
          <View style={styles.landscapeContainer}>
            <Timer
              display="25:00"
              style={styles.timer}
            />
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
          </View>
          <View style={[styles.landscapeContainer, styles.rightContainer]}>
            <Text>Hello there</Text>
          </View>
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }

  // Mobile view
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.topContainer}>
          <Timer
            display="25:00"
            style={styles.timer}
          />
          <PageButtonBar
            selected="focus"
            style={styles.pageButtonBar}
            // onPressFocus={() => handleStateSwitch('focus')}
            // onPressBreak={() => handleStateSwitch('break')}
          />
        </View>
        <View style={styles.bottomContainer}>
          <ActionButtonBar
            style={styles.actionButtonBar}
            text="The quick brown fox jumps over the lazy dog."
            state="stopped"
          />
        </View>
      </View>
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
  contentContainer: {
    height: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentContainerLandscape: {
    flexDirection: 'row',
  },
  topContainer: {
    justifyContent: 'flex-end',
  },
  bottomContainer: {
    justifyContent: 'flex-start',
  },
  landscapeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightContainer: {
    marginLeft: 20,
  },
  timer: {
    marginBottom: 15,
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
