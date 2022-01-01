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
  /* eslint-disable-next-line */
  onChange?: (number: number) => any,
  onDeselect?: () => any,
  /**
   * Enables the darker border but does not focus the text.
   */
  keyboardSelected?: boolean,
}

function NumberBox({
  text, selected, onChange, keyboardSelected, onDeselect,
}: Props) {
  const colors = useTheme();

  const ref = useRef<TextInput>();

  useEffect(() => {
    if (selected) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [selected]);

  return (
    // @ts-ignore
    <TextInput
      caretHidden
      style={[styles.container, TextStyles.textRegular, {
        backgroundColor: colors.gray5,
        borderWidth: selected || keyboardSelected ? 1 : 0,
        borderColor: selected || keyboardSelected ? colors.primary : undefined,
        color: colors.primary,
        textAlign: 'center',
      }, Platform.OS === 'web' ? {
        // @ts-ignore
        outline: 'none',
      } : undefined]}
      value={`${text}`}
      keyboardType="numeric"
      ref={ref}
      textAlign="center"
      onChangeText={(newText) => {
        if (onChange && !Number.isNaN(Number(newText))) {
          onChange(Number(newText));
        }
      }}
      onBlur={() => {
        if (selected && onDeselect) {
          onDeselect();
        }
      }}
      maxLength={3}
      selectTextOnFocus
      selectionColor={colors.primary}
    />
  );
}

NumberBox.defaultProps = {
  selected: false,
  keyboardSelected: false,
  onChange: () => {},
  onDeselect: () => {},
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
