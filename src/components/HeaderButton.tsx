import { Ionicons } from '@expo/vector-icons';
import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import useTheme from '../helpers/hooks/useTheme';

interface HeaderButtonProps {
  iconName: string,
  to: {
    screen: string,
    params: any,
  },
}

/**
 * Component representing a left or right header button on mobile.
 * @param props
 */
function HeaderButton({ iconName, to }: HeaderButtonProps) {
  const { onPress } = useLinkProps({ to });

  const colorValues = useTheme();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Ionicons
        // @ts-ignore
        name={iconName}
        size={22}
        color={colorValues.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 44,
    width: 44,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default HeaderButton;
