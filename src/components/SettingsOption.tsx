import React from 'react';
import {
  Platform, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';
import Checkbox from './Checkbox';
import NumberBox from './NumberBox';

interface Props {
  type: 'number' | 'toggle',
  value?: boolean | number,
  /* eslint-disable-next-line */
  onChange?: (data: any) => any,
  title?: string,
  onPress?: () => any,
  onSelect?: () => any,
  selected?: boolean,
}

function SettingsOption({
  type, onPress, title, value, selected, onChange, onSelect,
}: Props) {
  const colors = useTheme();

  const children = (
    <View
      style={[styles.container, {
        // @ts-ignore
        cursor: Platform.OS === 'web' ? 'pointer' : undefined,
      }]}
      onClick={Platform.OS === 'web' ? onPress : undefined}
    >
      <Text style={[TextStyles.textRegular, {
        color: colors.primary,
      }]}
      >
        {title}

      </Text>
      {type === 'toggle' ? (
        <Checkbox
          selected={value === true}
        />
      ) : undefined}
      {type === 'number' ? (
        <NumberBox
          text={value || 0}
          selected={selected}
          onChange={onChange}
          onSelect={onSelect}
        />
      ) : undefined}
    </View>
  );

  if (Platform.OS === 'web') {
    return children;
  }

  return (
    <TouchableOpacity
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
  },
});

SettingsOption.defaultProps = {
  onChange: () => {},
  onPress: () => {},
  onSelect: () => {},
  title: '',
  value: false,
  selected: false,
};

export default SettingsOption;
