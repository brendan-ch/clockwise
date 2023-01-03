import { useContext, useEffect, useState } from 'react';
import {
  Appearance, AppState, AppStateStatus, ColorSchemeName,
} from 'react-native';
import SettingsContext from '../../../SettingsContext';
import { AUTO_APPEARANCE, DARK_MODE } from '../../StorageKeys';
import ColorValues from '../../styles/Color';
import { Colors, DefaultSettingsState } from '../../types';

/**
 * Hook that automatically returns a color scheme based on device theme settings.
 */
function useTheme(providedContext?: DefaultSettingsState): Colors {
  // const colorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>('light');

  useEffect(() => {
    function changeColorScheme(state: AppStateStatus) {
      if (state === 'active') {
        // Update the color scheme
        const newColorScheme = Appearance.getColorScheme();
        setColorScheme(newColorScheme);
      }
    }

    AppState.addEventListener('change', changeColorScheme);

    return () => AppState.removeEventListener('change', changeColorScheme);
  }, []);

  let context = useContext(SettingsContext);
  if (providedContext) {
    context = providedContext;
  }

  // User's setting overrides system appearance
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
