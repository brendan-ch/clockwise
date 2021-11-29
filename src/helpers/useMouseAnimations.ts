import { useRef } from 'react';
import { Animated } from 'react-native';

/**
 * Hook that adds animation timings for mouse hovering.
 */
function useMouseAnimations() {
  const mouseHoverAnimation = useRef(new Animated.Value(0)).current;

  function onMouseEnter() {
    Animated.timing(mouseHoverAnimation, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  function onMouseLeave() {
    Animated.timing(mouseHoverAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }

  return { mouseHoverAnimation, onMouseEnter, onMouseLeave };
}

export default useMouseAnimations;
