import { Ionicons } from '@expo/vector-icons';
import React, { useContext } from 'react';
import {
  Pressable, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppContext from '../../AppContext';

interface Props {
  onDismiss?: () => any,
  // eslint-disable-next-line
  children: JSX.Element,
  onClick?: () => any,
}

function MessageBanner({ onDismiss, children, onClick }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useContext(AppContext);

  return (
    <Pressable
      style={[styles.container, {
        backgroundColor: colors.primary,
        paddingTop: insets.top > 0 ? insets.top : 10,
      }]}
      onPress={onClick}
    >
      {children}
      <Pressable
        onPress={onDismiss ? () => onDismiss() : undefined}
      >
        <Ionicons name="close-outline" size={20} color={colors.gray3} />
      </Pressable>
    </Pressable>
  );
}

MessageBanner.defaultProps = {
  onDismiss: () => {},
  onClick: () => {},
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    width: '100%',
  },
});

export default MessageBanner;
