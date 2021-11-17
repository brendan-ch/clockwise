import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  View, Text, StyleProp, ViewStyle, StyleSheet, TouchableOpacity,
} from 'react-native';
import ColorValues from '../styles/Color';
import TextStyles from '../styles/Text';

interface Props {
  onDismiss?: () => any,
  style?: StyleProp<ViewStyle>,
}

function DismissBar({ onDismiss }: { onDismiss?: () => any }) {
  return (
    <View style={styles.dismissBar}>
      <TouchableOpacity
        onPress={onDismiss}
        style={styles.closeButton}
      >
        <Ionicons name="close-outline" size={20} />
      </TouchableOpacity>
    </View>
  );
}

DismissBar.defaultProps = {
  onDismiss: () => {},
};

/**
 * This component is shown to the user on first open.
 * @param props
 */
function Introduction({ onDismiss, style }: Props) {
  return (
    <View style={[style, styles.container]}>
      <DismissBar onDismiss={onDismiss} />
      <Text style={TextStyles.textBold}>session: an app designed to help you focus</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: ColorValues.gray5,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  dismissBar: {
    display: 'flex',
    width: '100%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Introduction.defaultProps = {
  onDismiss: () => {},
  style: {},
};

export default Introduction;
