import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import TextStyles from '../styles/Text';

interface Props {
  text: string,
  onPress: () => any,
}

function PageButton({ text, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Text style={TextStyles.textRegular}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // Fill space evenly
    flex: 1,
    // Centering the text
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PageButton;
