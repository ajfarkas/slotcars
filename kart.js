const { PI } = Math;
const TAU = PI * 2;
const HALFPI = PI / 2;
const ONE_DEG_IN_RAD = TAU / 360;

const SPEED = 10;
const TURN_SENSITIVITY = ONE_DEG_IN_RAD * 2;

const $id = (identify) => document.getElementById(identify);
const getStyle = (value, el) =>
  getComputedStyle(el || document.documentElement)
  .getPropertyValue(value);

const body = document.querySelector('body');
const world = $id('world');
const board = $id('board');
const car = $id('racecar');
const pause = $id('pause');

const PERSPECTIVE = parseInt(getStyle('perspective', body));
const ADJUSTMENT = parseInt(getStyle('--adjustment', body));
const BOARD_H = parseInt(getStyle('--board-h', world));
const SOUTH_POINT = -1 * PERSPECTIVE;
const BOARD_VIEW = 0 - ADJUSTMENT - (parseInt(getStyle('height', car)) / 2);
const BOARD_TRANS = `translateY(-50%) rotateX(90deg) translateZ(${BOARD_VIEW}px)`;

board.style.transform = BOARD_TRANS;

let move;
let NORTH = SOUTH_POINT + 0;
let EAST = 0;
let ANGLE = 0;

const getDirection = angle => {
  // Delta is [-1...1]
  let eastDelta = 0;
  const northDelta = 1 - (2 * Math.abs(angle) / PI);
  if (angle > 0) {
    eastDelta = 1 - Math.abs((angle - HALFPI) / HALFPI);
  } else if (angle < 0) {
    eastDelta = -1 + Math.abs((angle + HALFPI) / HALFPI);
  }

  return [northDelta, eastDelta];
};

const correctAngle = angle => {
  angle %= TAU;
  // only use [-PI...PI]
  if (angle > PI) {
    angle = -1 * PI + angle - PI;
  } else if (angle < (-1 * PI)) {
    angle = TAU - angle;
  }
  return angle;
};

const play = () => setInterval(() => {
  Object.entries(activeKeys).forEach(([k, v]) => {
    if (!v) return;

    if (k === 'ArrowLeft') {
      if (activeKeys.ArrowDown) {
        ANGLE += TURN_SENSITIVITY;
      } else {
        ANGLE -= TURN_SENSITIVITY;
      }
      ANGLE = correctAngle(ANGLE);
    }
    if (k === 'ArrowRight') {
      if (activeKeys.ArrowDown) {
        ANGLE -= TURN_SENSITIVITY;
      } else {
        ANGLE += TURN_SENSITIVITY;
      }
      ANGLE = correctAngle(ANGLE);
    };

    const [northFactor, eastFactor] = getDirection(ANGLE);
    if (k === 'ArrowUp') {
      NORTH += (northFactor * SPEED);
      EAST -= (eastFactor * SPEED);
    }
    if (k === 'ArrowDown') {
      NORTH -= (northFactor * SPEED);
      EAST += (eastFactor * SPEED);
    };
  });

  board.style.transform = `${BOARD_TRANS} translateY(${NORTH}px) translateX(${EAST}px)`;
  world.style.transform = `rotateY(${ANGLE}rad)`;
  car.style.transform = `translateX(-50%) rotateY(${-1 * ANGLE}rad)`;

}, 15);

const stop = () => clearInterval(move);

const activeKeys = [];
let isPlaying = true;
document.addEventListener('keyup', ev => {
  const { key } = ev;
  if (!key.match('Arrow')) return;
  delete activeKeys[key];
});
document.addEventListener('keydown', ev => {
  const { key } = ev;
  if (key.match('Enter')) {
    if (isPlaying) {
      stop();
      isPlaying = false;
      pause.style.visibility = 'visible';
    } else {
      pause.style.visibility = 'hidden';
      isPlaying = true;
      move = play();
    }
  }
  if (!key.match('Arrow')) return;
  activeKeys[key] = true;
});

move = play();
