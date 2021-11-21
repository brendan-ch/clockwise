type TimerState = 'running' | 'paused' | 'stopped';

/**
 * Provides typings for React Navigation route parameters.
 */
type RootStackParamList = {
  Timer: undefined,
  Settings: undefined,
}

export { TimerState, RootStackParamList };
