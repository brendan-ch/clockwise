import {
  useWindowDimensions,
} from 'react-native';

/**
 * Hook that returns one of three window sizes.
 */
function useWindowSize() {
  // Get dimensions
  const { height, width } = useWindowDimensions();

  // Return a size
  if (height < 600 && width < 700) {
    return 'small';
  }

  if (width >= 700) {
    return 'landscape';
  }

  return 'portrait';
}

export default useWindowSize;
