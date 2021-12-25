import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, View, Animated, FlatList,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import useWindowSize from '../helpers/useWindowSize';
// import Selector from './Selector';
import SettingsOption from './SettingsOption';

// interface SelectorProps {
//   index: string,
//   text?: string,
//   subtitle?: string,
//   iconRight?: string,
//   iconLeft?: string,
//   onPressLeft?: () => any,
//   onPressRight?: () => any,
//   onPress?: () => any,
//   /* eslint-disable-next-line */
//   onChangeText?: (text: string) => any,
// }

interface SettingsOptionProps {
  index: string,
  type: 'number' | 'toggle' | 'icon',
  value?: boolean | number | string,
  /* eslint-disable-next-line */
  onChange?: (data: any) => any,
  title?: string,
  onPress?: () => any,
  disabled?: boolean,
  /* eslint-disable-next-line */
  onChangeText?: (text: string) => any,
}

interface Props {
  data: SettingsOptionProps[],
  header: SettingsOptionProps,
  expanded: boolean,
  fadeInOnMount?: boolean,
}

/**
 * Component that can expand with additional Selector components.
 */
function SelectorGroup({
  data, header, expanded, fadeInOnMount,
}: Props) {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const expandedAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const colorValues = useTheme();

  const windowSize = useWindowSize();

  useEffect(() => {
    if (fadeInOnMount) {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 50,
        useNativeDriver: false,
      }).start();
    }
  }, [fadeInOnMount]);

  useEffect(() => {
    if (expanded) {
      Animated.timing(expandedAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(expandedAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [expanded]);

  const renderSelector = ({ item }: { item: SettingsOptionProps }) => (
    <View style={styles.headerContainer}>
      <View style={{
        width: expanded ? 9 : 0,
      }}
      />
      <SettingsOption
        onChange={item.onChange}
        selected={selected === item.index}
        onSelect={() => setSelected(item.index)}
        onPress={() => {
          if (item.type === 'number' && selected === item.index) {
            setSelected(undefined);
          } else if (item.type === 'number') {
            setSelected(item.index);
          } else if (item.onPress) {
            item.onPress();
          }
        }}
        type={item.type}
        value={item.value}
        title={item.title}
        style={{
          width: windowSize === 'portrait' ? 250 : 260,
        }}
        disabled={item.disabled}
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
        {/* Line separating header from settings */}
        <View style={{
          width: expanded ? 9 : 0,
        }}
        />
        <SettingsOption
          style={{ flex: 1 }}
          title={header.title}
          type={header.type}
          // subtitle={header.subtitle}
          value={header.value}
          // iconLeft={header.iconLeft}
          // onPressLeft={header.onPressLeft}
          // onPressRight={header.onPressRight}
          onPress={header.onPress}
          onChangeText={expanded ? header.onChangeText : undefined}
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
