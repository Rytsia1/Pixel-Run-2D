
import React, { useEffect } from 'react';

const DURATION_MS = 500;

const keyframes = `
  @keyframes dust-burst {
    0% {
      transform: scale(0.8) translate(0, 0);
      opacity: 0.8;
    }
    100% {
      transform: scale(1.2) translate(var(--tx, 0), var(--ty, 0));
      opacity: 0;
    }
  }
`;

const styleSheetId = 'dust-animation-stylesheet';
if (!document.getElementById(styleSheetId)) {
  const styleSheet = document.createElement("style");
  styleSheet.id = styleSheetId;
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);
}

const DustParticle: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={{
    position: 'absolute',
    backgroundColor: '#A0AEC0', // gray-500
    borderRadius: '50%',
    animationName: 'dust-burst',
    animationTimingFunction: 'ease-out',
    animationDuration: `${DURATION_MS}ms`,
    animationFillMode: 'forwards',
    ...style,
  }} />
);

interface DustCloudProps {
  id: string;
  x: number;
  y: number;
  onAnimationEnd: (id: string) => void;
}

const DustCloud: React.FC<DustCloudProps> = ({ id, x, y, onAnimationEnd }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onAnimationEnd(id);
    }, DURATION_MS);
    return () => clearTimeout(timer);
  }, [id, onAnimationEnd]);

  const particles = [
    { width: 8, height: 8, left: -4, bottom: 0, '--tx': '-25px', '--ty': '10px', animationDelay: '0ms' },
    { width: 10, height: 10, left: -5, bottom: 0, '--tx': '-10px', '--ty': '15px', animationDelay: '50ms' },
    { width: 8, height: 8, left: -4, bottom: 0, '--tx': '15px', '--ty': '8px', animationDelay: '20ms' },
    { width: 6, height: 6, left: -3, bottom: 0, '--tx': '20px', '--ty': '12px', animationDelay: '70ms' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}px`,
        bottom: `${y}px`,
        width: 1,
        height: 1,
      }}
      aria-hidden="true"
    >
      {particles.map((p, i) => <DustParticle key={i} style={p as React.CSSProperties} />)}
    </div>
  );
};

export default DustCloud;
