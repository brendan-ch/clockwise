type TimerState = 'running' | 'paused' | 'stopped';
type Overlay = 'none' | 'settings' | 'command';

/**
 * Provides typings for React Navigation route parameters.
 */
type RootStackParamList = {
  Timer: undefined,
  Settings: undefined,
}

export { TimerState, RootStackParamList, Overlay };
