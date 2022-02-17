import React, { ReactChild } from 'react';
import {
  Image, ImageSourcePropType, ImageStyle, StyleProp, StyleSheet, Text, View, ViewStyle,
} from 'react-native';
import useTheme from '../helpers/hooks/useTheme';
import TextStyles from '../styles/Text';

interface Props {
  title: string,
  children: ReactChild,
  style?: StyleProp<ViewStyle>,
  imageStyle?: StyleProp<ImageStyle>,
  image?: ImageSourcePropType,
}

function IntroductionBlock({
  title, children, style, imageStyle, image,
}: Props) {
  const colorValues = useTheme();

  return (
    <View style={[styles.container, style]}>
      {image ? (
        <Image
          source={image}
          style={[{ marginBottom: 10 }, imageStyle]}
          resizeMode="center"
        />
      ) : undefined}
      <Text style={[TextStyles.textBold, {
        color: colorValues.primary,
      }]}
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
