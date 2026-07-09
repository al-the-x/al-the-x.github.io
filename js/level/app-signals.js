import {
  computed,
  signal
} from 'https://esm.sh/@preact/signals@1.3.2';

export const STATES = {
  LOADING: Symbol('LOADING'),
  STARTING: Symbol('STARTING'),
  RUNNING: Symbol('RUNNING'),
  LOCKED: Symbol('LOCKED'),
  FAILED: Symbol('FAILED')
};

export function createAppSignals(initialState = STATES.LOADING) {
  const app = signal({
    state: initialState,
    error: null
  });

  const state = computed(() => app.value.state);
  const error = computed(() => app.value.error);

  const transitionInto = (nextStateOrError) => {
    app.value = {
      ...app.value,
      ...(nextStateOrError instanceof Error
        ? { state: STATES.FAILED, error: nextStateOrError }
        : { state: nextStateOrError, error: null })
    };
  };

  const clearError = () => {
    transitionInto(app.value.state);
  };

  const fail = (nextError) => {
    transitionInto(nextError);
  };

  return {
    app,
    state,
    error,
    transitionInto,
    clearError,
    fail
  };
}
