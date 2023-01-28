import { Ionicons } from '@expo/vector-icons';
import { useLinkProps } from '@react-navigation/native';
import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import AppContext from '../../AppContext';

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

  const { colors } = useContext(AppContext);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
    >
      <Ionicons
        // @ts-ignore
        name={iconName}
        size={22}
        color={colors.primary}
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
