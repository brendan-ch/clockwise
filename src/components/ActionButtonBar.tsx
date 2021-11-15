import React from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import ColorValues from '../styles/Color';
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
      <Text style={[TextStyles.textItalic, styles.text]}>{text}</Text>
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
          <View style={styles.resumeResetContainer}>
            <ActionButton
              style={styles.bigActionButton}
              text="resume"
              onPress={onResumePress}
            />
            <ActionButton
              style={styles.smallActionButton}
              onPress={onResetPress}
              isResetButton
            />
          </View>
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
  text: {
    marginBottom: 15,
    textAlign: 'center',
    color: ColorValues.gray3,
  },
  buttonContainer: {
    height: 67,
    width: '100%',
  },
  resumeResetContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bigActionButton: {
    flex: 1,
  },
  smallActionButton: {
    height: '100%',
    width: 67,
    marginLeft: 10,
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
