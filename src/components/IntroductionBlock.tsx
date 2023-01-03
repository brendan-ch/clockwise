import React, { useContext } from 'react';
import {
  Image, StyleSheet, Text, View,
} from 'react-native';
import AppContext from '../../AppContext';
import TextStyles from '../styles/Text';
import { IntroductionBlockProps } from '../types';

function IntroductionBlock({
  title, children, style, imageStyle, image,
}: IntroductionBlockProps) {
  const { colors } = useContext(AppContext);

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
          color: colors.primary,
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
