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
    appSignals.setState(STATES.Starting);

    await runAction(async () => {
      await orientation.requestMotionPermission();
      await orientation.start();
      appSignals.setState(STATES.Running);
    });
  };

  const onToggleFullscreen = async () => {
    await runAction(async () => {
      await orientation.toggleFullscreen();
    });
  };

  const onToggleOrientationLock = async () => {
    await runAction(async () => {
      if (appSignals.state.value !== STATES.Locked) {
        await orientation.lockPortrait();
        appSignals.clearError();
        orientation.stop();
        await orientation.start();
        appSignals.setState(STATES.Locked);
        return;
      }

      orientation.unlockOrientation();
      appSignals.clearError();
      orientation.stop();
      await orientation.start();
      appSignals.setState(STATES.Running);
    });
  };

  const appState = appSignals.state.value;
  const appError = appSignals.error.value;
  const statusText = {
    [STATES.Loading]: 'Ready.',
    [STATES.Starting]: 'Starting orientation sensor...',
    [STATES.Running]: 'Move your phone to use the level.',
    [STATES.Locked]: 'Orientation locked.',
    [STATES.Failed]: appError?.message || 'An error occurred.'
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
          ${appState === STATES.Starting ? 'Starting…' : 'Enable motion'}
        </button>
        <button type="button" onClick=${onToggleFullscreen}>
          ${orientation.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        </button>
        <button
          type="button"
          onClick=${onToggleOrientationLock}
          disabled=${appState !== STATES.Running && appState !== STATES.Locked}
        >
          ${appState === STATES.Locked ? 'Unlock orientation' : 'Lock orientation'}
        </button>
      </p>
      <p style="text-align:center;margin-top:.5rem;">
        roll ${roll.toFixed(1)}°, pitch ${pitch.toFixed(1)}°
      </p>
    </div>
  `;
}
