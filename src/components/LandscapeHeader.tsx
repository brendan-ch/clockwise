import { Ionicons } from '@expo/vector-icons';
import React, {
  useContext, useState, useRef, useEffect,
} from 'react';
import {
  Platform, Pressable, StyleSheet, Text, View, Animated,
} from 'react-native';
import AppContext from '../../AppContext';
import TextStyles from '../styles/Text';
import { Colors } from '../types';

/**
 * Props for the header button.
 */
interface Props {
  iconName?: string,
  onPress?: () => any,
  colors: Colors,
}

/**
 * Render a header button.
 */
function HeaderButton({ iconName, onPress, colors }: Props) {
  const [hovering, setHovering] = useState(false);

  const colorValues = colors;

  return (
    <Pressable onPress={onPress}>
      <View
        style={[buttonStyles.container]}
        // @ts-ignore
        onMouseEnter={Platform.OS === 'web' ? () => setHovering(true) : undefined}
        onMouseLeave={Platform.OS === 'web' ? () => setHovering(false) : undefined}
      >
        {iconName ? (
          <Ionicons
            // @ts-ignore
            name={iconName}
            size={30}
            color={hovering ? colorValues.gray3 : colorValues.gray4}
          />
        ) : undefined}
      </View>
    </Pressable>
  );
}

const buttonStyles = StyleSheet.create({
  container: {
    width: 35,
    height: 35,
  },
});

HeaderButton.defaultProps = {
  iconName: undefined,
  onPress: () => {},
};

/**
 * Render a landscape view header.
 */
function LandscapeHeader() {
  const [hovering, setHovering] = useState(false);

  const context = useContext(AppContext);
  const opacityAnimation = useRef(new Animated.Value(0)).current;

  const colorValues = context.colors;

  useEffect(() => {
    if (context.timerState === 'running' && !hovering) {
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(opacityAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: false,
      }).start();
    }
  }, [context.timerState, hovering]);

  return (
    // Outside container to control padding
    <View
      style={styles.container}
      // @ts-ignore
      onMouseEnter={Platform.OS === 'web' ? () => setHovering(true) : undefined}
      onMouseLeave={Platform.OS === 'web' ? () => setHovering(false) : undefined}
    >
      {/* Content container to host the actual content */}
      <View style={styles.contentContainer}>
        {/* View to host the title text */}
        <Animated.View style={[styles.headerTitle, {
          opacity: opacityAnimation,
        }]}
        >
          <Text style={[TextStyles.textBold, {
            color: colorValues.primary,
            fontSize: 49,
          }]}
          >
            clockwise

          </Text>
          {/* To guarantee that text will display on multiple lines,
              wrap the text with a view */}
          <View style={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            marginLeft: 7,
          }}
          >
            <Text
              style={[TextStyles.textBold, {
                color: colorValues.gray3,
              }]}
            >
              an app designed to

            </Text>
            <Text
              style={[TextStyles.textBold, {
                color: colorValues.gray3,
              }]}
            >
              help you focus.
            </Text>
          </View>
        </Animated.View>
        {/* Header buttons */}
        <Animated.View style={[styles.buttonContainer, {
          opacity: opacityAnimation,
        }]}
        >
          <HeaderButton
            colors={colorValues}
            iconName="settings-outline"
            onPress={() => context.setOverlay('settings')}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Outer container
  // Used to wrap content container
  container: {
    width: '100%',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // Content container
  contentContainer: {
    // For when landscape view is resized to be smaller
    minWidth: 670,
    // Default width
    width: '70%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // Wrapper for the title and subtitle
  headerTitle: {
    flexDirection: 'row',
    width: 350,
    alignItems: 'center',
  },
  // Wrapper for the header buttons
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default LandscapeHeader;
