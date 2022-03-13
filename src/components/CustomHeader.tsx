import React from 'react';
import { Platform, View } from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import HeaderButton from './HeaderButton';

function CustomHeader() {
  const colors = useTheme();

  return (
    <View
      style={{
        flexDirection: 'column',
        justifyContent: 'flex-end',
        width: '100%',
        height: Platform.OS === 'web' ? 64 : 35,
        backgroundColor: colors.background,
        opacity: 0.9,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          paddingHorizontal: 15,
          height: Platform.OS === 'web' ? 64 : 35,
          width: '100%',
          backgroundColor: colors.background,
        }}
      >
        <HeaderButton
          iconName="ellipsis-vertical"
          to={{
            screen: 'Settings',
            params: {},
          }}
        />
      </View>
    </View>
  );
}

export default CustomHeader;
