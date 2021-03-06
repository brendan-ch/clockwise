import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  title?: string,
  icon?: string,
}

/**
 * Settings header in the section list.
 * @param props
 */
function SettingsHeader({ title, icon }: Props) {
  const colors = useTheme();

  return (
    <View style={[styles.container, {
      borderBottomColor: colors.gray4,
      backgroundColor: colors.background,
    }]}
    >
      <Ionicons
        // @ts-ignore
        name={icon}
        color={colors.primary}
        size={20}
        style={{
          marginRight: 10,
        }}
      />
      <Text
        style={[TextStyles.textBold, {
          color: colors.primary,
        }]}
        maxFontSizeMultiplier={1.35}
      >
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
});

SettingsHeader.defaultProps = {
  title: '',
  icon: 'grid',
};

export default SettingsHeader;
