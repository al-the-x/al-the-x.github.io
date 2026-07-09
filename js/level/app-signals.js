import {
  computed,
  signal
} from 'https://esm.sh/@preact/signals@1.3.2';

export const STATES = {
  Loading: 'loading',
  Starting: 'starting',
  Running: 'running',
  Locked: 'locked',
  Failed: 'failed'
};

export function createAppSignals(initialState = STATES.Loading) {
  const app = signal({
    state: initialState,
    error: null
  });

  const state = computed(() => app.value.state);
  const error = computed(() => app.value.error);

  const setState = (nextState) => {
    app.value = {
      ...app.value,
      state: nextState
    };
  };

  const clearError = () => {
    app.value = {
      ...app.value,
      error: null
    };
  };

  const fail = (nextError) => {
    app.value = {
      state: STATES.Failed,
      error: nextError
    };
  };

  return {
    app,
    state,
    error,
    setState,
    clearError,
    fail
  };
}
