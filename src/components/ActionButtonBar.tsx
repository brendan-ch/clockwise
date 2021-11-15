import React from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import TextStyles from '../styles/Text';
import ActionButton from './ActionButton';

interface Props {
  text?: string,
  state: 'stopped' | 'running' | 'paused',
  onStartPress?: () => any,
  onResetPress?: () => any,
  onPausePress?: () => any,
  onResumePress?: () => any,
  style?: StyleProp<ViewStyle>,
}

/**
 * Action button bar that displays time estimation text and start/pause buttons.
 * @param props
 */
function ActionButtonBar({
  text,
  state,
  onStartPress,
  onResetPress,
  onPausePress,
  onResumePress,
  style,
}: Props) {
  return (
    <View style={[style, styles.container]}>
      <Text style={TextStyles.textItalic}>{text}</Text>
      <View style={styles.buttonContainer}>
        {state === 'stopped' ? (
          <ActionButton
            style={styles.bigActionButton}
            text="start"
            onPress={onStartPress}
          />
        ) : undefined}
        {state === 'running' ? (
          <ActionButton
            style={styles.bigActionButton}
            text="pause"
            onPress={onPausePress}
          />
        ) : undefined}
        {state === 'paused' ? (
          <ActionButton
            style={styles.bigActionButton}
            text="resume"
            onPress={onResumePress}
          />
        ) : undefined}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  buttonContainer: {
    height: 67,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigActionButton: {
    flex: 1,
  },
});

ActionButtonBar.defaultProps = {
  text: '',
  onStartPress: () => {},
  onResetPress: () => {},
  onPausePress: () => {},
  onResumePress: () => {},
  style: {},
};

export default ActionButtonBar;
