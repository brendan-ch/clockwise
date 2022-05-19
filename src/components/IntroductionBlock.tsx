import React from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';
import { IntroductionBlockProps } from '../types';

function IntroductionBlock({
  title, children, style, imageStyle, image,
}: IntroductionBlockProps) {
  const colorValues = useTheme();

  return (
    <View style={[styles.container, style]}>
      {image ? (
        <Image
          source={image}
          style={[{ marginBottom: 10 }, imageStyle]}
          // resizeMode="center"
        />
      ) : undefined}
      <Text
        style={[TextStyles.textBold, {
          color: colorValues.primary,
        }]}
        maxFontSizeMultiplier={1.35}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
});

IntroductionBlock.defaultProps = {
  image: undefined,
  style: {},
  imageStyle: {},
};

export default IntroductionBlock;
