import React, { useEffect, useRef } from 'react';
import {
  StyleSheet, View, Animated, FlatList,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import Selector from './Selector';

interface SelectorProps {
  index: string,
  text?: string,
  subtitle?: string,
  iconRight?: string,
  iconLeft?: string,
  onPressLeft?: () => any,
  onPressRight?: () => any,
  onPress?: () => any,
}

interface Props {
  data: SelectorProps[],
  header: SelectorProps,
  expanded: boolean,
  fadeInOnMount?: boolean,
}

/**
 * Component that can expand with additional Selector components.
 */
function SelectorGroup({
  data, header, expanded, fadeInOnMount,
}: Props) {
  const expandedAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const colorValues = useTheme();

  useEffect(() => {
    if (fadeInOnMount) {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }).start();
    }
  }, [fadeInOnMount]);

  useEffect(() => {
    if (expanded) {
      Animated.timing(expandedAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(expandedAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  }, [expanded]);

  const renderSelector = ({ item }: { item: SelectorProps }) => (
    <View style={styles.headerContainer}>
      <Animated.View style={{
        // width: expandedAnimation.interpolate({
        //   inputRange: [0, 1],
        //   outputRange: [0, 9],
        // }),
        width: expanded ? 9 : 0,
      }}
      />
      <Selector
        text={item.text}
        iconRight={item.iconRight}
      />
    </View>
  );

  return (
    <Animated.View style={[styles.container, {
      borderRadius: 2,
      borderWidth: expanded ? 1 : 0,
      borderColor: colorValues.gray5,
      opacity: fadeInOnMount ? opacityAnimation : 1,
      height: expandedAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [52, 52 + (50 * data.length)],
      }),
      overflow: 'hidden',
    }]}
    >
      <View style={styles.headerContainer}>
        <Animated.View style={{
          // width: expandedAnimation.interpolate({
          //   inputRange: [0, 1],
          //   outputRange: [0, 9],
          // }),
          width: expanded ? 9 : 0,
        }}
        />
        <Selector
          style={{ flex: 1 }}
          text={header.text}
          subtitle={header.subtitle}
          iconRight={header.iconRight}
          iconLeft={header.iconLeft}
          onPressLeft={header.onPressLeft}
          onPressRight={header.onPressRight}
          onPress={header.onPress}
        />
      </View>
      {expanded ? (
        <View style={[styles.line, {
          backgroundColor: colorValues.gray5,
        }]}
        />
      ) : undefined}
      {expanded ? (
        <FlatList
          style={styles.optionList}
          data={data}
          renderItem={renderSelector}
          keyExtractor={(item) => item.index}
        />
      ) : undefined}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  line: {
    width: '100%',
    height: 1,
  },
  optionList: {
    width: '100%',
  },
});

SelectorGroup.defaultProps = {
  fadeInOnMount: false,
};

export default SelectorGroup;
