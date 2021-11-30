import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
}

function SettingsOption({
  type, onChange, title, value,
}: Props) {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[TextStyles.textBold, {
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
        />
      ) : undefined}
    </View>
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
  title: '',
  value: false,
};

export default SettingsOption;
