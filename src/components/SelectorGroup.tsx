import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, View, Animated, FlatList, StyleProp, TextStyle,
} from 'react-native';
import useTheme from '../helpers/useTheme';
import SettingsOption from './SettingsOption';

interface SettingsOptionProps {
  index: string,
  type: 'number' | 'toggle' | 'icon',
  value?: boolean | number | string,
  iconLeft?: string,
  /* eslint-disable-next-line */
  onChange?: (data: any) => any,
  title?: string,
  onPress?: () => any,
  onPressRight?: () => any,
  onPressLeft?: () => any,
  disabled?: boolean,
  /* eslint-disable-next-line */
  onChangeText?: (text: string) => any,
  titleStyle?: StyleProp<TextStyle>,
}

interface Props {
  data: SettingsOptionProps[],
  header: SettingsOptionProps,
  expanded: boolean,
  fadeInOnMount?: boolean,
}

/**
 * Component that can expand with additional SettingOption components.
 */
function SelectorGroup({
  data, header, expanded, fadeInOnMount,
}: Props) {
  const [selected, setSelected] = useState<string | undefined>(undefined);

  const expandedAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const colorValues = useTheme();

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
      onPressRight={item.onPressRight}
      onPressLeft={item.onPressLeft}
      type={item.type}
      value={item.value}
      iconLeft={item.iconLeft}
      title={item.title}
      disabled={item.disabled}
      style={{
        marginHorizontal: 5,
      }}
      titleStyle={item.titleStyle}
    />
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
      width: '100%',
    }]}
    >
      <SettingsOption
        title={header.title}
        type={header.type}
        value={header.value}
        iconLeft={header.iconLeft}
        onPressRight={header.onPressRight}
        onPressLeft={header.onPressLeft}
        onPress={header.onPress}
        onChangeText={expanded ? header.onChangeText : undefined}
        style={{
          marginLeft: expanded ? 5 : 0,
        }}
        titleStyle={header.titleStyle}
      />
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
    alignItems: 'stretch',
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
