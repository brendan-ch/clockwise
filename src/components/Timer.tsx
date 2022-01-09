import React from 'react';
import {
  StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle,
} from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  display?: string,
  style?: StyleProp<ViewStyle>,
  textStyle?: StyleProp<TextStyle>,
}

/**
 * Timer display component.
 * @param param0
 */
function Timer({ display, style, textStyle }: Props) {
  const colorValues = useTheme();

  return (
    <View style={[style, styles.container]}>
      <Text
        style={[TextStyles.textBold, textStyle, styles.text, {
          color: colorValues.primary,
        }]}
        allowFontScaling={false}
      >
        {display}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 100,
  },
});

Timer.defaultProps = {
  style: {},
  textStyle: {},
  display: '',
};

export default Timer;
