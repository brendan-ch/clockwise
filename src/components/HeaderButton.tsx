import { Ionicons } from '@expo/vector-icons';
import { Link } from '@react-navigation/native';
import React from 'react';

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
  return (
    // <TouchableOpacity
    //   style={headerButtonStyles.container}
    //   onPress={onPress}
    // >
    <Link
      to={to}
    >
      <Ionicons
        // @ts-ignore
        name={iconName}
        size={22}
      />
    </Link>
    // </TouchableOpacity>
  );
}

export default HeaderButton;
