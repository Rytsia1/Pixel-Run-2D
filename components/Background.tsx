
import React from 'react';
import { GAME_WIDTH, GROUND_Y_OFFSET } from '../constants';

interface BackgroundProps {
  cloudOffset: number;
  mountainOffset: number;
  groundOffset: number;
}

const keyframes = `
  @keyframes subtle-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes subtle-shift {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(2px); }
  }
  @keyframes scroll-line {
    to { background-position-x: -20px; }
  }
`;

const styleSheetId = 'background-animation-stylesheet';
if (!document.getElementById(styleSheetId)) {
  const styleSheet = document.createElement("style");
  styleSheet.id = styleSheetId;
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);
}

const ParallaxLayer: React.FC<{
  offsetX: number;
  width: number;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ offsetX, width, children, className, style }) => {
  const transform = `translateX(${(offsetX % width)}px)`;
  
  return (
    <div className={className} style={{ position: 'absolute', inset: 0, ...style }}>
      <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${width * 2}px`, transform }}>
        <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${width}px` }}>
          {children}
        </div>
        <div style={{ position: 'absolute', left: `${width}px`, top: 0, height: '100%', width: `${width}px` }}>
          {children}
        </div>
      </div>
    </div>
  );
};

const Clouds = () => (
  <>
    <div className="absolute bg-gray-400 opacity-60 rounded-full" style={{ top: '50px', left: '100px', width: '120px', height: '35px', animation: 'subtle-bob 6s ease-in-out infinite' }} />
    <div className="absolute bg-gray-400 opacity-60 rounded-full" style={{ top: '70px', left: '125px', width: '80px', height: '25px', animation: 'subtle-bob 6.5s ease-in-out infinite 0.5s' }} />
    <div className="absolute bg-gray-500 opacity-50 rounded-full" style={{ top: '60px', left: '400px', width: '180px', height: '50px', animation: 'subtle-bob 8s ease-in-out infinite' }} />
    <div className="absolute bg-gray-500 opacity-50 rounded-full" style={{ top: '85px', left: '430px', width: '120px', height: '30px', animation: 'subtle-bob 8.5s ease-in-out infinite 0.8s' }} />
    <div className="absolute bg-gray-400 opacity-60 rounded-full" style={{ top: '40px', left: '700px', width: '100px', height: '25px', animation: 'subtle-bob 7s ease-in-out infinite 0.3s' }} />
  </>
);

const Mountains = () => (
  <>
    <div className="absolute bottom-0" style={{ left: '50px', width: '0', height: '0', borderLeft: '150px solid transparent', borderRight: '150px solid transparent', borderBottom: '120px solid #2d3748', animation: 'subtle-shift 15s ease-in-out infinite' }} />
    <div className="absolute bottom-0" style={{ left: '250px', width: '0', height: '0', borderLeft: '200px solid transparent', borderRight: '200px solid transparent', borderBottom: '180px solid #4a5568', animation: 'subtle-shift 12s ease-in-out infinite 1s' }} />
    <div className="absolute bottom-0" style={{ left: '550px', width: '0', height: '0', borderLeft: '180px solid transparent', borderRight: '180px solid transparent', borderBottom: '150px solid #2d3748', animation: 'subtle-shift 18s ease-in-out infinite 0.5s' }} />
  </>
);

const Ground = () => (
  <div 
    className="bg-lime-700 w-full h-full relative"
  >
     <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '4px',
      backgroundImage: 'linear-gradient(to right, #A3E635 75%, transparent 25%)',
      backgroundSize: '20px 4px',
      backgroundRepeat: 'repeat-x',
      animation: 'scroll-line 0.25s linear infinite',
      willChange: 'background-position',
    }}/>
  </div>
);

const Background: React.FC<BackgroundProps> = ({ cloudOffset, mountainOffset, groundOffset }) => {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <ParallaxLayer offsetX={cloudOffset} width={GAME_WIDTH}>
        <Clouds />
      </ParallaxLayer>
      <ParallaxLayer offsetX={mountainOffset} width={GAME_WIDTH} style={{ bottom: `${GROUND_Y_OFFSET}px`, top: 'auto', height: '180px' }}>
        <Mountains />
      </ParallaxLayer>
      <ParallaxLayer offsetX={groundOffset} width={GAME_WIDTH} style={{ bottom: '0px', top: 'auto', height: `${GROUND_Y_OFFSET}px` }}>
        <Ground />
      </ParallaxLayer>
    </div>
  );
};

export default Background;
