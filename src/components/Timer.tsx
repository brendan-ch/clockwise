import React, { useContext } from 'react';
import {
  StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle,
} from 'react-native';
import AppContext from '../../AppContext';
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
  const { colors } = useContext(AppContext);

  return (
    <View style={[style, styles.container]}>
      <Text
        style={[TextStyles.textBold, textStyle, styles.text, {
          color: colors.primary,
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
