import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

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
        <Text>{value === true ? 'true' : 'false'}</Text>
      ) : undefined}
      {type === 'number' ? (
        <Text>{value}</Text>
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
