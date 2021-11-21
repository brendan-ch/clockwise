import { Ionicons } from '@expo/vector-icons';
import { useLinkProps } from '@react-navigation/native';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import useTheme from '../helpers/useTheme';

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
      // style={headerButtonStyles.container}
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

export default HeaderButton;
