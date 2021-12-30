import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  leftButton?: {
    text: string,
    onPress: () => any,
    primary?: boolean,
  },
  rightButton?: {
    text: string,
    onPress: () => any,
    primary?: boolean,
  }
}

interface ButtonProps {
  text: string,
  onPress: () => any,
  primary?: boolean,
}

function OverlayButton({ text, onPress, primary }: ButtonProps) {
  const colors = useTheme();

  return (
    <TouchableOpacity
      style={[buttonStyles.container, {
        backgroundColor: primary ? colors.primary : colors.background,
      }]}
      onPress={() => onPress()}
    >
      <Text style={[TextStyles.textRegular, {
        color: primary ? colors.background : colors.primary,
      }]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

OverlayButton.defaultProps = {
  primary: false,
};

const buttonStyles = StyleSheet.create({
  container: {
    height: 40,
    flexGrow: 0,
    flexBasis: 'auto',
  },
});

/**
 * Display a set of buttons.
 */
function OverlayButtonBar({ leftButton, rightButton }: Props) {
  return (
    <View style={styles.container}>
      {leftButton ? (
        <OverlayButton
          text={leftButton.text}
          onPress={leftButton.onPress}
          primary={leftButton.primary}
        />
      ) : undefined}
      {rightButton ? (
        <OverlayButton
          text={rightButton.text}
          onPress={rightButton.onPress}
          primary={rightButton.primary}
        />
      ) : undefined}
    </View>
  );
}

OverlayButtonBar.defaultProps = {
  leftButton: undefined,
  rightButton: undefined,
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
});

export default OverlayButtonBar;
