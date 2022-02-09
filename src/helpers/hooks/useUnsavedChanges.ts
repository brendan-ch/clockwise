import { useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import AppContext from '../../../AppContext';

/**
 * Hook that alerts the user before leaving the page.
 * Depends on AppContext.
 */
function useUnsavedChanges() {
  const context = useContext(AppContext);

  function alertUser(e: any) {
    e.preventDefault();
    e.returnValue = '';
  }

  useEffect(() => {
    if (Platform.OS !== 'web' || context.timerState === 'stopped') return () => {};

    window.addEventListener('beforeunload', alertUser);

    return () => {
      window.removeEventListener('beforeunload', alertUser);
    };
  }, [context.timerState]);
}

export default useUnsavedChanges;
