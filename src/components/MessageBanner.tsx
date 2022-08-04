import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Pressable, StyleSheet,
} from 'react-native';
import useTheme from '../helpers/hooks/useTheme';

interface Props {
  onDismiss?: () => any,
  // eslint-disable-next-line
  children: JSX.Element,
  onClick?: () => any,
}

function MessageBanner({ onDismiss, children, onClick }: Props) {
  const colors = useTheme();

  return (
    <Pressable
      style={[styles.container, {
        backgroundColor: colors.primary,
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
    height: 50,
    width: '100%',
  },
});

export default MessageBanner;
