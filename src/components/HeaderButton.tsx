import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface HeaderButtonProps {
  iconName: string,
  onPress?: () => any,
}

/**
 * Component representing a left or right header button on mobile.
 * @param props
 */
function HeaderButton({ iconName, onPress }: HeaderButtonProps) {
  return (
    <TouchableOpacity
      style={headerButtonStyles.container}
      onPress={onPress}
    >
      <Ionicons
        // @ts-ignore
        name={iconName}
        size={22}
      />
    </TouchableOpacity>
  );
}

export default HeaderButton;

HeaderButton.defaultProps = {
  onPress: () => {},
};

const headerButtonStyles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
