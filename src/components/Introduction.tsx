import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useRef } from 'react';
import {
  View, Text, StyleProp, ViewStyle, StyleSheet, TouchableOpacity, Animated, ScrollView, Platform,
} from 'react-native';
import AppContext from '../../AppContext';
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
        <Ionicons name="close-outline" size={20} color={ColorValues.gray3} />
      </TouchableOpacity>
    </View>
  );
}

DismissBar.defaultProps = {
  onDismiss: undefined,
};

/**
 * This component is shown to the user on first open.
 * @param props
 */
function Introduction({ onDismiss, style }: Props) {
  const fadeAnimation = useRef(new Animated.Value(1)).current;

  const { colors } = useContext(AppContext);

  /**
   * Fade out the component, and call onDismiss.
   */
  function fadeOutAndDismiss() {
    if (onDismiss) {
      Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start(() => {
        onDismiss();
      });
    }
  }

  return (
    <Animated.View
      style={[style, styles.container, {
        opacity: fadeAnimation,
        paddingTop: onDismiss ? 0 : 10,
        borderColor: colors.gray5,
      }]}
    >
      {onDismiss
        ? <DismissBar onDismiss={() => fadeOutAndDismiss()} />
        : undefined}
      <ScrollView>
        <Text
          style={[TextStyles.textBold, styles.text, {
            color: colors.primary,
          }]}
        >
          Clockwise: an app designed to help you focus
        </Text>
        <Text
          style={[TextStyles.textRegular, styles.text, {
            color: colors.primary,
          }]}
        >
          This is a simple Pomodoro timer to help you get things done quicker.
        </Text>
        {Platform.OS === 'web' ? (
          // Display keyboard shortcuts
          <View>
            <Text
              style={[TextStyles.textBold, styles.text, {
                color: colors.primary,
              }]}
            >
              Keyboard shortcuts:
            </Text>
            <Text
              style={[TextStyles.textRegular, styles.text, {
                color: colors.primary,
              }]}
            >
              1: switch to focus view
            </Text>
            <Text
              style={[TextStyles.textRegular, styles.text, {
                color: colors.primary,
              }]}
            >
              2: switch to break view
            </Text>
            <Text
              style={[TextStyles.textRegular, styles.text, {
                color: colors.primary,
              }]}
            >
              Space: start/pause the timer
            </Text>
            <Text
              style={[TextStyles.textRegular, styles.text, {
                color: colors.primary,
              }]}
            >
              R: reset the timer
            </Text>
            <Text
              style={[TextStyles.textRegular, styles.text, {
                color: colors.primary,
              }]}
            >
              ⌘/Ctrl + ,: open settings
            </Text>
          </View>
        ) : undefined}
      </ScrollView>
    </Animated.View>
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
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

Introduction.defaultProps = {
  onDismiss: undefined,
  style: {},
};

export default Introduction;
