
import React from 'react';
import { PlayerState } from '../types';
import { PLAYER_X_POSITION, PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants';

// This SVG contains three animation frames side-by-side for our dinosaur.
// Frame 1 (at x=0): Jumping/Idle state.
// Frame 2 (at x=40): Running state, leg 1.
// Frame 3 (at x=80): Running state, leg 2.
const dinoSpriteSheet = `
<svg width="${PLAYER_WIDTH * 3}" height="${PLAYER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <!-- Frame 1: Jumping/Idle -->
  <g>
    <rect x="10" y="0" width="30" height="20" fill="#6EE7B7" stroke="#047857" stroke-width="2"/>
    <rect x="0" y="20" width="35" height="40" fill="#6EE7B7" stroke="#047857" stroke-width="2"/>
    <rect x="5" y="40" width="10" height="20" fill="#34D399" stroke="#047857" stroke-width="2"/>
    <rect x="20" y="40" width="10" height="20" fill="#34D399" stroke="#047857" stroke-width="2"/>
    <rect x="32" y="5" width="5" height="5" fill="#10B981"/>
  </g>
  <!-- Frame 2: Running 1 -->
  <g transform="translate(${PLAYER_WIDTH}, 0)">
    <rect x="10" y="0" width="30" height="20" fill="#6EE7B7" stroke="#047857" stroke-width="2"/>
    <rect x="0" y="20" width="35" height="40" fill="#6EE7B7" stroke="#047857" stroke-width="2"/>
    <rect x="5" y="40" width="10" height="15" fill="#34D399" stroke="#047857" stroke-width="2"/>
    <rect x="20" y="40" width="10" height="20" fill="#34D399" stroke="#047857" stroke-width="2"/>
    <rect x="32" y="5" width="5" height="5" fill="#10B981"/>
  </g>
  <!-- Frame 3: Running 2 -->
  <g transform="translate(${PLAYER_WIDTH * 2}, 0)">
    <rect x="10" y="0" width="30" height="20" fill="#6EE7B7" stroke="#047857" stroke-width="2"/>
    <rect x="0" y="20" width="35" height="40" fill="#6EE7B7" stroke="#047857" stroke-width="2"/>
    <rect x="5" y="40" width="10" height="20" fill="#34D399" stroke="#047857" stroke-width="2"/>
    <rect x="20" y="40" width="10" height="15" fill="#34D399" stroke="#047857" stroke-width="2"/>
    <rect x="32" y="5" width="5" height="5" fill="#10B981"/>
  </g>
</svg>
`;

const dinoSpriteURI = `data:image/svg+xml;base64,${btoa(dinoSpriteSheet)}`;

const keyframes = `
  @keyframes dino-run {
    0% { background-position: -${PLAYER_WIDTH}px 0; }
    100% { background-position: -${PLAYER_WIDTH * 2}px 0; }
  }
  @keyframes dino-flash {
    50% { opacity: 0.3; }
  }
`;

const styleSheetId = 'dino-animation-stylesheet';
if (!document.getElementById(styleSheetId)) {
  const styleSheet = document.createElement("style");
  styleSheet.id = styleSheetId;
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);
}

const Dinosaur: React.FC<{ player: PlayerState, isInvincible: boolean }> = ({ player, isInvincible }) => {
  const { isJumping } = player;

  const runningAnimation = 'dino-run 0.2s steps(1, end) infinite';
  const invincibilityAnimation = 'dino-flash 0.2s linear infinite';

  let animationValue = isJumping ? 'none' : runningAnimation;
  if (isInvincible) {
    animationValue = animationValue === 'none' 
      ? invincibilityAnimation 
      : `${runningAnimation}, ${invincibilityAnimation}`;
  }

  const style: React.CSSProperties = {
    position: 'absolute',
    left: `${PLAYER_X_POSITION}px`,
    bottom: `${player.y}px`,
    width: `${player.width}px`,
    height: `${player.height}px`,
    backgroundImage: `url('${dinoSpriteURI}')`,
    backgroundSize: `${player.width * 3}px ${player.height}px`,
    backgroundRepeat: 'no-repeat',
    animation: animationValue,
    backgroundPosition: isJumping ? '0px 0px' : '',
  };

  return <div style={style} aria-label={`dinosaur ${isJumping ? 'jumping' : 'running'}`} />;
};

export { Dinosaur };
