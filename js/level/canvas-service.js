import p5 from 'https://cdn.jsdelivr.net/npm/p5@1.11.7/+esm';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function createLevelCanvas({ container, orientationRef }) {
  return new p5((p) => {
    const getSize = () => Math.min(window.innerWidth * 0.8, 420);

    p.setup = () => {
      p.createCanvas(getSize(), getSize()).parent(container);
    };

    p.windowResized = () => {
      p.resizeCanvas(getSize(), getSize());
    };

    p.draw = () => {
      const width = p.width;
      const height = p.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const outerRadius = Math.min(width, height) / 2 - 16;
      const moveRadius = outerRadius * 0.78;
      const x = centerX + (clamp(orientationRef.current.roll, -45, 45) / 45) * moveRadius;
      const y = centerY + (clamp(orientationRef.current.pitch, -45, 45) / 45) * moveRadius;

      p.background('#0f172a');

      p.stroke('#334155');
      p.strokeWeight(3);
      p.noFill();
      p.circle(centerX, centerY, outerRadius * 2);

      p.stroke('#475569');
      p.strokeWeight(1);
      p.line(centerX - outerRadius, centerY, centerX + outerRadius, centerY);
      p.line(centerX, centerY - outerRadius, centerX, centerY + outerRadius);

      p.noStroke();
      p.fill('#22c55e');
      p.circle(x, y, outerRadius * 0.26);

      p.fill('#e2e8f0');
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.text(`roll: ${orientationRef.current.roll.toFixed(1)}°`, centerX, height - 34);
      p.text(`pitch: ${orientationRef.current.pitch.toFixed(1)}°`, centerX, height - 14);
    };
  });
}
