import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

/**
 * Handle haptic feedback on all platforms.
 * @param type
 * @param style
 */
async function handleHaptic(type: 'impact' | 'selection' | 'notification', style?: Haptics.ImpactFeedbackStyle | Haptics.NotificationFeedbackType) {
  if (Platform.OS === 'web') return;

  switch (type) {
    case 'impact':
      // @ts-ignore
      await Haptics.impactAsync(style);
      break;
    case 'selection':
      await Haptics.selectionAsync();
      break;
    case 'notification':
      // @ts-ignore
      await Haptics.notificationAsync(style);
      break;
    default:
      await Haptics.selectionAsync();
  }
}

export default handleHaptic;
