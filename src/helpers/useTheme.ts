import { useColorScheme } from 'react-native';
import ColorValues from '../styles/Color';

interface Colors {
  primary: string,
  gray1: string,
  gray2: string,
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
      gray5: ColorValues.gray1,
      gray4: ColorValues.gray2,
      gray2: ColorValues.gray4,
      gray1: ColorValues.gray5,
    };
  }

  return ColorValues;
  // const [appearance, setAppearance] = useState<'light' | 'dark'>('light');

  // useEffect(() => {

  // });
}

export default useTheme;
