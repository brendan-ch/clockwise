import { Ionicons } from '@expo/vector-icons';
import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

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

  return (
    <TouchableOpacity
      // style={headerButtonStyles.container}
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
