import React, { useContext } from 'react';
import {
  StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import AppContext from '../../AppContext';
import TextStyles from '../styles/Text';
import { TimerState } from '../types';
import ActionButton from './ActionButton';

interface Props {
  text?: string,
  state: TimerState,
  onStartPress?: () => any,
  onResetPress?: () => any,
  onPausePress?: () => any,
  onResumePress?: () => any,
  onSkipPress?: () => any,
  style?: StyleProp<ViewStyle>,
  disabled?: boolean,
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
  onSkipPress,
  style,
  disabled,
}: Props) {
  const { colors } = useContext(AppContext);

  let displayText = 'start';
  let method = onStartPress;

  if (state === 'running') {
    displayText = 'pause';
    method = onPausePress;
  } else if (state === 'paused') {
    displayText = 'resume';
    method = onResumePress;
  }

  const sideButtonMethod = state === 'running' ? onSkipPress : onResetPress;

  return (
    <View style={[style, styles.container]}>
      <Text
        style={[TextStyles.textItalic, styles.text, {
          color: colors.gray2,
        }]}
        maxFontSizeMultiplier={1.35}
      >
        {text}
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.resumeResetContainer}>
          {state === 'stopped' || state === 'paused' ? (
            <ActionButton
              style={styles.bigActionButton}
              value={displayText}
              onPress={disabled ? undefined : method}
              haptics
            />
          ) : undefined}
          {state === 'running' ? (
            <ActionButton
              style={styles.bigActionButton}
              value={displayText}
              onPress={disabled ? undefined : method}
              background
            />
          ) : undefined}
          {state === 'paused' || state === 'running' ? (
            <ActionButton
              style={styles.smallActionButton}
              onPress={disabled || !sideButtonMethod ? undefined : sideButtonMethod}
              isIconButton
              value={state === 'paused' ? 'refresh-outline' : 'play-forward-outline'}
              background={state === 'running'}
            />
          ) : undefined}
        </View>
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
  onSkipPress: () => {},
  style: {},
  disabled: false,
};

export default ActionButtonBar;
