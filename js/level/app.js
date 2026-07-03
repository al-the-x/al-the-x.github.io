import {
  html,
  useEffect,
  useRef,
  useState
} from 'https://unpkg.com/htm@3.1.1/preact/standalone.module.js';

import { createLevelCanvas } from './canvas-service.js';
import {
  canRequestMotionPermission,
  createOrientationController
} from './fulltilt-service.js';

const STATES = {
  Loading: 'loading',
  Starting: 'starting',
  Running: 'running',
  Locked: 'locked',
  Failed: 'failed'
};

export function LevelApp({ DeviceOrientation }) {
  const canvasContainerRef = useRef(null);
  const orientationRef = useRef({ roll: 0, pitch: 0 });
  const orientationControllerRef = useRef(null);

  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [appState, setAppState] = useState(STATES.Loading);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  const stopOrientation = () => {
    orientationControllerRef.current?.stop?.();
  };

  const updateFailedState = (message) => {
    setErrorMessage(message);
    setAppState(STATES.Failed);
  };

  const startOrientation = (nextState = STATES.Running) => {
    const controller = orientationControllerRef.current;

    if (!controller) {
      updateFailedState('Orientation API is unavailable on this device/browser.');
      return;
    }

    setErrorMessage('');
    setAppState(STATES.Starting);

    controller.start(
      () => {
        setAppState(nextState);
      },
      () => {
        stopOrientation();
        updateFailedState('Orientation API is unavailable on this device/browser.');
      }
    );
  };

  useEffect(() => {
    const sketch = createLevelCanvas({
      container: canvasContainerRef.current,
      orientationRef
    });

    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      stopOrientation();
      sketch.remove();
    };
  }, []);

  useEffect(() => {
    const controller = createOrientationController(DeviceOrientation);

    controller.listen(() => {
      const euler = controller.getScreenAdjustedEuler();

      if (!euler) {
        return;
      }

      const nextPitch = euler.beta || 0;
      const nextRoll = euler.gamma || 0;

      orientationRef.current = { roll: nextRoll, pitch: nextPitch };
      setRoll(nextRoll);
      setPitch(nextPitch);
    });

    orientationControllerRef.current = controller;

    return () => {
      stopOrientation();
      orientationControllerRef.current = null;
    };
  }, [DeviceOrientation]);

  const onEnableMotion = async () => {
    if (canRequestMotionPermission) {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();

        if (permission !== 'granted') {
          updateFailedState('Motion permission denied.');
          return;
        }
      } catch (error) {
        updateFailedState('Could not request motion permission.');
        return;
      }
    }

    startOrientation();
  };

  const onToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        return;
      }

      await document.exitFullscreen?.();
    } catch (error) {
      updateFailedState('Could not change fullscreen mode.');
    }
  };

  const onToggleOrientationLock = async () => {
    if (!screen.orientation?.lock) {
      updateFailedState('Orientation lock is not supported in this browser.');
      return;
    }

    if (appState !== STATES.Locked) {
      try {
        await screen.orientation.lock('portrait-primary');
        setErrorMessage('');
        stopOrientation();
        startOrientation(STATES.Locked);
      } catch (error) {
        updateFailedState('Could not lock orientation (fullscreen may be required).');
      }

      return;
    }

    screen.orientation.unlock?.();
    setErrorMessage('');
    stopOrientation();
    startOrientation(STATES.Running);
  };

  const statusText = {
    [STATES.Loading]: 'Ready.',
    [STATES.Starting]: 'Starting orientation sensor...',
    [STATES.Running]: 'Move your phone to use the level.',
    [STATES.Locked]: 'Orientation locked.',
    [STATES.Failed]: errorMessage || 'An error occurred.'
  }[appState];

  return html`
    <div>
      <p id="level-status">${statusText}</p>
      <div
        ref=${canvasContainerRef}
        style="display:block;margin:1rem auto;max-width:100%;width:max-content;background:#111;border-radius:12px;overflow:hidden;"
      ></div>
      <p style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;">
        <button type="button" onClick=${onEnableMotion}>
          ${appState === STATES.Starting ? 'Starting…' : 'Enable motion'}
        </button>
        <button type="button" onClick=${onToggleFullscreen}>
          ${isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
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
