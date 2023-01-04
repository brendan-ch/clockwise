import React, { useContext } from 'react';
import {
  StyleSheet, Text, View,
} from 'react-native';
import AppContext from '../../AppContext';
import TextStyles from '../styles/Text';
import OverlayButtonBar from './OverlayButtonBar';

interface Props {
  onClose?: () => any,
  onConfirm?: () => any,
}

/**
 * Component that displays a warning if the timer is running.
 */
function TimerWarningOverlay({ onClose, onConfirm }: Props) {
  const { colors } = useContext(AppContext);

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
    }]}
    >
      <Text style={[TextStyles.textBold, styles.headerText, {
        marginBottom: 5,
        color: colors.primary,
      }]}
      >
        Timer is active

      </Text>
      <Text style={[TextStyles.textItalic, {
        color: colors.primary,
        marginBottom: 5,
      }]}
      >
        Doing this will cause the timer to reset. Are you sure you want to continue?
      </Text>
      <OverlayButtonBar
        leftButton={{
          text: 'no thanks',
          onPress: onClose ? () => onClose() : () => {},
          primary: true,
        }}
        rightButton={{
          text: 'confirm',
          onPress: onConfirm ? () => onConfirm() : () => {},
        }}
      />
    </View>
  );
}

TimerWarningOverlay.defaultProps = {
  onClose: () => {},
  onConfirm: () => {},
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    width: 300,
    justifyContent: 'flex-start',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 17,
  },
});

export default TimerWarningOverlay;
