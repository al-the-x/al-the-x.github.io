import {
  html,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'https://unpkg.com/htm@3.1.1/preact/standalone.module.js';

import {
  createAppSignals,
  STATES
} from './app-signals.js';
import { useCanvas } from './use-canvas.js';
import { useOrientation } from './use-orientation.js';

export function LevelApp({ DeviceOrientation }) {
  const orientationRef = useRef({ roll: 0, pitch: 0 });
  const appSignals = useMemo(() => createAppSignals(), []);

  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);

  const onOrientationChange = useCallback(({ roll: nextRoll, pitch: nextPitch }) => {
    orientationRef.current = {
      roll: nextRoll,
      pitch: nextPitch
    };
    setRoll(nextRoll);
    setPitch(nextPitch);
  }, []);

  const { canvasRef } = useCanvas({ orientationRef });
  const orientation = useOrientation({
    DeviceOrientation,
    onOrientationChange
  });

  const updateFailedState = (error) => {
    appSignals.fail(error);
  };

  const runAction = async (action) => {
    try {
      await action();
    } catch (error) {
      updateFailedState(error instanceof Error ? error : new Error('An error occurred.'));
    }
  };

  const onEnableMotion = async () => {
    appSignals.clearError();
    appSignals.transitionInto(STATES.STARTING);

    await runAction(async () => {
      await orientation.requestMotionPermission();
      await orientation.start();
      appSignals.transitionInto(STATES.RUNNING);
    });
  };

  const onToggleFullscreen = async () => {
    await runAction(async () => {
      await orientation.toggleFullscreen();
    });
  };

  const onToggleOrientationLock = async () => {
    await runAction(async () => {
      if (appSignals.state.value !== STATES.LOCKED) {
        await orientation.lockPortrait();
        appSignals.clearError();
        orientation.stop();
        await orientation.start();
        appSignals.transitionInto(STATES.LOCKED);
        return;
      }

      orientation.unlockOrientation();
      appSignals.clearError();
      orientation.stop();
      await orientation.start();
      appSignals.transitionInto(STATES.RUNNING);
    });
  };

  const appState = appSignals.state.value;
  const appError = appSignals.error.value;
  const statusText = {
    [STATES.LOADING]: 'Ready.',
    [STATES.STARTING]: 'Starting orientation sensor...',
    [STATES.RUNNING]: 'Move your phone to use the level.',
    [STATES.LOCKED]: 'Orientation locked.',
    [STATES.FAILED]: appError?.message || 'An error occurred.'
  }[appState];

  return html`
    <div>
      <p id="level-status">${statusText}</p>
      <div
        ref=${canvasRef}
        style="display:block;margin:1rem auto;max-width:100%;width:max-content;background:#111;border-radius:12px;overflow:hidden;"
      ></div>
      <p style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;">
        <button type="button" onClick=${onEnableMotion}>
          ${appState === STATES.STARTING ? 'Starting…' : 'Enable motion'}
        </button>
        <button type="button" onClick=${onToggleFullscreen}>
          ${orientation.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </button>
        <button
          type="button"
          onClick=${onToggleOrientationLock}
          disabled=${appState !== STATES.RUNNING && appState !== STATES.LOCKED}
        >
          ${appState === STATES.LOCKED ? 'Unlock orientation' : 'Lock orientation'}
        </button>
      </p>
      <p style="text-align:center;margin-top:.5rem;">
        roll ${roll.toFixed(1)}°, pitch ${pitch.toFixed(1)}°
      </p>
    </div>
  `;
}
