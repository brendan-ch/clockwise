import React, {
  useContext, useEffect, useRef, useState,
} from 'react';
import {
  StyleSheet, View, Animated, FlatList,
} from 'react-native';
import AppContext from '../../AppContext';
import useTheme from '../helpers/hooks/useTheme';
import { KeyboardShortcutGroup, SettingsOptionProps } from '../types';
import SettingsOption from './SettingsOption';

/**
 * Indicate keybindings for each SettingsOption component.
 */
interface SelectorKeybinding {
  title: string,
  pressLeft?: string[][],
  pressRight?: string[][],
  press?: string[][],
  pressInput?: string[][],
  select?: string[][]
  deselect?: string[][],
}

interface Props {
  data: SettingsOptionProps[],
  header: SettingsOptionProps,
  keybindings?: SelectorKeybinding[],
  headerKeybindings?: SelectorKeybinding,
  expanded: boolean,
  fadeInOnMount?: boolean,
  activeKeyboardGroup?: KeyboardShortcutGroup,
  /**
   * If the selector group is conditionally rendered based on an array,
   * provide the array here so keybindings work properly.
   */
  outsideData?: any[],
  onKeyboardShown?: () => any,
}

/**
 * Component that can expand with additional SettingOption components.
 */
function SelectorGroup({
  data,
  header,
  expanded,
  fadeInOnMount, activeKeyboardGroup, outsideData, keybindings, headerKeybindings, onKeyboardShown,
}: Props) {
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [headerInputSelected, setHeaderInputSelected] = useState(false);

  const expandedAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const colorValues = useTheme();

  const {
    keyboardGroup,
    keyboardShortcutManager,
  } = useContext(AppContext);

  // Register keybinds for data
  useEffect(() => {
    const unsubMethods: (() => any)[] = [];

    if (keyboardGroup !== activeKeyboardGroup
      || !keyboardShortcutManager
      || !expanded
      || !keybindings) {
      return () => {};
    }

    // Set keybindings if available
    keybindings.forEach((item) => {
      if (item.select) {
        item.select.forEach((keybinding) => {
          unsubMethods.push(keyboardShortcutManager.registerEvent({
            keys: keybinding,
            action: () => setSelected(item.title),
          }));
        });
      }

      const matchingData = data.find((option) => option.title === item.title);
      if (item.press && matchingData?.onPress) {
        item.press.forEach((keybinding) => {
          unsubMethods.push(keyboardShortcutManager.registerEvent({
            keys: keybinding,
            // @ts-ignore
            action: () => matchingData.onPress(),
          }));
        });
      }

      if (item.pressLeft && matchingData?.onPressLeft) {
        item.pressLeft.forEach((keybinding) => {
          unsubMethods.push(keyboardShortcutManager.registerEvent({
            keys: keybinding,
            // @ts-ignore
            action: () => matchingData.onPressLeft(),
          }));
        });
      }

      if (item.pressRight && matchingData?.onPressRight) {
        item.pressRight.forEach((keybinding) => {
          unsubMethods.push(keyboardShortcutManager.registerEvent({
            keys: keybinding,
            // @ts-ignore
            action: () => item.onPressRight(),
          }));
        });
      }
    });

    return () => unsubMethods.forEach((method) => {
      method();
    });
  }, [
    data,
    keybindings,
    keyboardGroup,
    keyboardShortcutManager,
    selected,
    outsideData,
    expanded,
  ]);

  // Register keybind for header
  useEffect(() => {
    const unsubMethods: (() => any)[] = [];
    if (!keyboardShortcutManager
      || keyboardGroup !== activeKeyboardGroup
      || !expanded
      || !headerKeybindings
    ) {
      return () => {};
    }

    if (headerKeybindings.pressInput && header.onChangeText) {
      headerKeybindings.pressInput.forEach((keybinding) => {
        unsubMethods.push(keyboardShortcutManager.registerEvent({
          keys: keybinding,
          action: () => setHeaderInputSelected(true),
        }));
      });
    }

    if (headerKeybindings.pressLeft && header.onPressLeft) {
      headerKeybindings.pressLeft.forEach((keybinding) => {
        unsubMethods.push(keyboardShortcutManager.registerEvent({
          keys: keybinding,
          // @ts-ignore
          action: () => header.onPressLeft(),
        }));
      });
    }

    return () => unsubMethods.forEach((method) => {
      method();
    });
  }, [
    keyboardGroup,
    keyboardShortcutManager,
    selected,
    outsideData,
    expanded,
    headerInputSelected,
    headerKeybindings,
  ]);

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

  useEffect(() => {
    if (selected && onKeyboardShown) {
      onKeyboardShown();
    }
  }, [selected]);

  const renderSelector = ({ item }: { item: SettingsOptionProps }) => (
    <SettingsOption
      onChange={item.onChange}
      selected={selected === item.title}
      onSelect={() => setSelected(item.title)}
      onPress={() => {
        if (item.type === 'number' && selected === item.title) {
          setSelected(undefined);
        } else if (item.type === 'number') {
          setSelected(item.title);
        } else if (item.onPress) {
          item.onPress();
        }
      }}
      onDeselect={() => setSelected(undefined)}
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
      onInputSelect={item.onInputSelect}
      subtitle={item.subtitle}
      indicator={item.indicator}
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
        inputSelected={expanded ? headerInputSelected : false}
        onInputBlur={() => setHeaderInputSelected(false)}
        onInputSelect={header.onInputSelect}
        indicator={header.indicator}
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
          keyExtractor={(item) => item.title!}
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
  activeKeyboardGroup: undefined,
  keybindings: [],
  headerKeybindings: undefined,
  outsideData: [],
  onKeyboardShown: () => {},
};

export default SelectorGroup;
