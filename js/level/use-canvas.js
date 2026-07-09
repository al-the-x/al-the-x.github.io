import {
  useCallback,
  useEffect,
  useRef
} from 'https://unpkg.com/htm@3.1.1/preact/standalone.module.js';

import { createLevelCanvas } from './canvas-service.js';

export function useCanvas({ orientationRef }) {
  const sketchRef = useRef(null);

  const canvasRef = useCallback((node) => {
    if (!node) {
      sketchRef.current?.remove?.();
      sketchRef.current = null;
      return;
    }

    if (sketchRef.current) {
      return;
    }

    sketchRef.current = createLevelCanvas({
      container: node,
      orientationRef
    });
  }, [orientationRef]);

  useEffect(() => () => {
    sketchRef.current?.remove?.();
    sketchRef.current = null;
  }, []);

  return {
    canvasRef
  };
}
