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
  let displayText = 'start';
  let method = onStartPress;

  if (state === 'running') {
    displayText = 'pause';
    method = onPausePress;
  } else if (state === 'paused') {
    displayText = 'resume';
    method = onResumePress;
  }

  return (
    <View style={[style, styles.container]}>
      <Text style={[TextStyles.textItalic, styles.text]}>{text}</Text>
      <View style={styles.buttonContainer}>
        <View style={styles.resumeResetContainer}>
          {state === 'stopped' || state === 'paused' ? (
            <ActionButton
              style={styles.bigActionButton}
              text={displayText}
              onPress={method}
              haptics
            />
          ) : undefined}
          {state === 'running' ? (
            <ActionButton
              style={styles.bigActionButton}
              text={displayText}
              onPress={method}
              background
            />
          ) : undefined}
          {state === 'paused' ? (
            <ActionButton
              style={styles.smallActionButton}
              onPress={onResetPress}
              isResetButton
            />
          ) : undefined}
        </View>
        {/* {state === 'paused' ? (
        ) : undefined} */}
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
