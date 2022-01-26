import { useContext, useEffect, useState } from 'react';
import AppContext from '../../../AppContext';
import { KeyboardShortcutGroup } from '../../types';

/**
 * Add logic for arrow key selection, given an array of generic objects.
 * @param activeKeyboardGroup
 * @param data Array of generic objects.
 * @param key Key to extract when object is selected.
 */
function useKeyboardSelect(
  activeKeyboardGroup: KeyboardShortcutGroup,
  data: Object[],
  key: string,
) {
  const [keyboardSelected, setKeyboardSelected] = useState<string | undefined>(undefined);

  const {
    keyboardGroup,
    keyboardShortcutManager,
  } = useContext(AppContext);

  useEffect(() => {
    const unsubMethods: ((() => any) | undefined)[] = [];
    if (keyboardGroup === activeKeyboardGroup && keyboardSelected) {
      // @ts-ignore
      const indexOfCurrent = data.findIndex((value) => value[key] === keyboardSelected);
      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['ArrowDown'],
        action: () => setKeyboardSelected(
          data.length - 1 <= indexOfCurrent
            ? keyboardSelected
            // @ts-ignore
            : data[indexOfCurrent + 1][key],
        ),
      }));

      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['ArrowUp'],
        action: () => setKeyboardSelected(
          indexOfCurrent <= 0
            ? keyboardSelected
            // @ts-ignore
            : data[indexOfCurrent - 1][key],
        ),
      }));
    } else if (keyboardGroup === 'settingsPage' && !keyboardSelected) {
      unsubMethods.push(keyboardShortcutManager?.registerEvent({
        keys: ['ArrowDown'],
        // @ts-ignore
        action: () => setKeyboardSelected(data[0][key]),
      }));
    }

    return () => {
      unsubMethods.forEach((method) => {
        if (method) {
          method();
        }
      });
    };
  }, [keyboardShortcutManager, keyboardGroup, keyboardSelected]);

  return { setKeyboardSelected, keyboardSelected };
}

export default useKeyboardSelect;
