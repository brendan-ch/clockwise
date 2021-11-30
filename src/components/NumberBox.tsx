import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  text: string | number | boolean,
}

function NumberBox({ text }: Props) {
  const colors = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: colors.gray5,
    }]}
    >
      <Text style={[TextStyles.textRegular, {
        color: colors.primary,
      }]}
      >
        {text}

      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NumberBox;
