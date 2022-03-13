import React from 'react';
import { View } from 'react-native';
import HeaderButton from './HeaderButton';

function CustomHeader() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 22,
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
  );
}

export default CustomHeader;
