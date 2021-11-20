import { useColorScheme } from 'react-native';
import ColorValues from '../styles/Color';

interface Colors {
  primary: string,
  gray3: string,
  gray4: string,
  gray5: string,
  background: string,
}

/**
 * Hook that automatically returns a color scheme based on device theme settings.
 */
function useTheme(): Colors {
  const colorScheme = useColorScheme();

  if (colorScheme === 'dark') {
    return {
      ...ColorValues,
      primary: '#dbdbdb',
      background: '#000000',
    };
  }

  return ColorValues;
  // const [appearance, setAppearance] = useState<'light' | 'dark'>('light');

  // useEffect(() => {

  // });
}

export default useTheme;
