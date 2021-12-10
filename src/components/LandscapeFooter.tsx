import React from 'react';
import { StyleSheet, View } from 'react-native';

function LandscapeFooter() {
  return (
    <View style={styles.container} />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default LandscapeFooter;
