import { useContext } from 'react';
import { useColorScheme } from 'react-native';
import SettingsContext from '../../../SettingsContext';
import { AUTO_APPEARANCE, DARK_MODE } from '../../StorageKeys';
import ColorValues from '../../styles/Color';
import { DefaultSettingsState } from '../../types';

interface Colors {
  primary: string,
  gray1: string,
  gray2: string,
  gray3: string,
  gray4: string,
  gray5: string,
  background: string,
  backgroundTranslucent: string,
}

/**
 * Hook that automatically returns a color scheme based on device theme settings.
 */
function useTheme(providedContext?: DefaultSettingsState): Colors {
  const colorScheme = useColorScheme();

  let context = useContext(SettingsContext);
  if (providedContext) {
    context = providedContext;
  }

  if (
    (colorScheme === 'dark' && context[AUTO_APPEARANCE])
    || (context[DARK_MODE] && !context[AUTO_APPEARANCE])
  ) {
    return {
      ...ColorValues,
      primary: '#dbdbdb',
      background: '#000000',
      gray5: ColorValues.gray1,
      gray4: ColorValues.gray2,
      gray2: ColorValues.gray4,
      gray1: ColorValues.gray5,
      backgroundTranslucent: 'rgba(0, 0, 0, 0.9)',
    };
  }

  return ColorValues;
}

export default useTheme;
