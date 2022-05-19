import React, { useState } from 'react';
import {
  Platform, StyleProp, Text, TextStyle,
} from 'react-native';

interface Props {
  style: StyleProp<TextStyle>,
  text: string,
  onPress?: () => any,
}

/**
 * Makes text clickable.
 * @param props
 */
function ClickableText({ style, onPress, text }: Props) {
  const [hovering, setHovering] = useState(false);

  return (
    <Text
      maxFontSizeMultiplier={1.35}
      style={[style, {
        textDecorationLine: hovering ? 'underline' : 'none',
      }]}
      onPress={onPress}
      // @ts-ignore
      onMouseEnter={Platform.OS === 'web' ? () => setHovering(true) : undefined}
      onMouseLeave={Platform.OS === 'web' ? () => setHovering(false) : undefined}
    >
      {text}
    </Text>
  );
}

ClickableText.defaultProps = {
  onPress: () => {},
};

export default ClickableText;
