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

  const transitionInto = (nextState) => {
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
    transitionInto(STATES.FAILED);
    app.value = {
      ...app.value,
      error: nextError
    };
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
