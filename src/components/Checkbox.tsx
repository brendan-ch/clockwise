import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import useTheme from '../helpers/useTheme';

interface Props {
  selected?: boolean,
}

function Checkbox({ selected }: Props) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons
        name={selected ? 'checkbox' : 'checkbox-outline'}
        color={colors.primary}
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
};

export default Checkbox;
