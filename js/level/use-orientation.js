import {
  useEffect,
  useMemo,
  useRef,
  useState
} from 'https://unpkg.com/htm@3.1.1/preact/standalone.module.js';

import {
  canRequestMotionPermission,
  createOrientationController
} from './fulltilt-service.js';

export function useOrientation({ DeviceOrientation }) {
  const controller = useMemo(() => {
    if (!DeviceOrientation) {
      throw new Error('Orientation API is unavailable on this device/browser.');
    }

    return createOrientationController(DeviceOrientation);
  }, [DeviceOrientation]);

  const controllerRef = useRef(controller);
  const orientationRef = useRef({ roll: 0, pitch: 0 });
  const [roll, setRoll] = useState(0);
  const [pitch, setPitch] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));

  useEffect(() => {
    controllerRef.current = controller;

    controller.listen(() => {
      const euler = controller.getScreenAdjustedEuler();

      if (!euler) {
        return;
      }

      const nextOrientation = {
        roll: euler.gamma || 0,
        pitch: euler.beta || 0
      };
      orientationRef.current = nextOrientation;
      setRoll(nextOrientation.roll);
      setPitch(nextOrientation.pitch);
    });

    return () => {
      controller.stop?.();
    };
  }, [controller]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  const stop = () => {
    controllerRef.current?.stop?.();
  };

  const start = () => new Promise((resolve, reject) => {
    controllerRef.current?.start(
      () => resolve(),
      () => reject(new Error('Orientation API is unavailable on this device/browser.'))
    );
  });

  const requestMotionPermission = async () => {
    if (!canRequestMotionPermission) {
      return;
    }

    let permission;

    try {
      permission = await DeviceOrientationEvent.requestPermission();
    } catch (error) {
      throw new Error('Could not request motion permission.');
    }

    if (permission !== 'granted') {
      throw new Error('Motion permission denied.');
    }
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();
        return;
      }

      await document.exitFullscreen?.();
    } catch (error) {
      throw new Error('Could not change fullscreen mode.');
    }
  };

  const lockPortrait = async () => {
    if (!screen.orientation?.lock) {
      throw new Error('Orientation lock is not supported in this browser.');
    }

    try {
      await screen.orientation.lock('portrait-primary');
    } catch (error) {
      throw new Error('Could not lock orientation (fullscreen may be required).');
    }
  };

  const unlockOrientation = () => {
    screen.orientation.unlock?.();
  };

  return {
    orientationRef,
    roll,
    pitch,
    isFullscreen,
    start,
    stop,
    requestMotionPermission,
    toggleFullscreen,
    lockPortrait,
    unlockOrientation
  };
}
