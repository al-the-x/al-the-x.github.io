import 'https://cdn.jsdelivr.net/npm/fulltilt@0.7.1/dist/fulltilt.min.js';

export const canRequestMotionPermission =
  typeof DeviceOrientationEvent !== 'undefined' &&
  typeof DeviceOrientationEvent.requestPermission === 'function';

export function getDeviceOrientationClass() {
  if (!window.FULLTILT || !window.FULLTILT.DeviceOrientation) {
    throw new Error('Orientation library did not load.');
  }

  return window.FULLTILT.DeviceOrientation;
}

export function createOrientationController(DeviceOrientation) {
  return new DeviceOrientation({ type: 'game' });
}
