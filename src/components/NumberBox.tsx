import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  text: string | number | boolean,
  selected?: boolean,
}

function NumberBox({ text, selected }: Props) {
  const colors = useTheme();

  return (
    <View style={[styles.container, {
      backgroundColor: colors.gray5,
      borderWidth: selected ? 1 : 0,
      borderColor: selected ? colors.primary : undefined,
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

NumberBox.defaultProps = {
  selected: false,
};

const styles = StyleSheet.create({
  container: {
    height: 32,
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 1,
  },
});

export default NumberBox;
