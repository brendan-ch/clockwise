import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import AppContext from '../../AppContext';

interface Props {
  selected?: boolean,
  keyboardSelected?: boolean,
  disabled?: boolean,
}

function Checkbox({ selected, keyboardSelected, disabled }: Props) {
  const { colors } = useContext(AppContext);

  return (
    <View style={[styles.container, {
      borderWidth: keyboardSelected ? 1 : 0,
      borderColor: keyboardSelected ? colors.primary : undefined,
      marginLeft: 3,
    }]}
    >
      <Ionicons
        name={selected ? 'checkbox' : 'square-outline'}
        color={disabled ? colors.gray3 : colors.primary}
        size={20}
      />
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

Checkbox.defaultProps = {
  selected: false,
  keyboardSelected: false,
  disabled: false,
};

export default Checkbox;
