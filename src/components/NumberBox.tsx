import React, { useEffect, useRef } from 'react';
import {
  Platform,
  StyleSheet, TextInput,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  text: string | number | boolean,
  selected?: boolean,
}

function NumberBox({ text, selected }: Props) {
  const colors = useTheme();

  const ref = useRef<TextInput>();

  useEffect(() => {
    if (selected) {
      ref.current?.focus();
    }
  }, [selected]);

  return (
    // @ts-ignore
    <TextInput
      caretHidden
      style={[styles.container, TextStyles.textRegular, {
        backgroundColor: colors.gray5,
        borderWidth: selected ? 1 : 0,
        borderColor: selected ? colors.primary : undefined,
        color: colors.primary,
      }, Platform.OS === 'web' ? {
        // @ts-ignore
        outline: 'none',
      } : undefined]}
      value={`${text}`}
      keyboardType="numeric"
      ref={ref}
    />
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
