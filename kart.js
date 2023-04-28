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
const world = $id("world");
const board = $id("board");

const PERSPECTIVE = parseInt(getStyle('perspective', body));
const BOARD_H = parseInt(getStyle("height", world));
const SOUTH_POINT = -1 * PERSPECTIVE;
const WORLD_TRANS = ''; // `translateZ(${0.5 * BOARD_H}px)`;
const BOARD_TRANS = `rotateX(90deg) translateZ(${PERSPECTIVE }px)`;

board.style.transform = `${BOARD_TRANS}  translateY(0) rotateZ(0)`;

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

const activeKeys = [];
document.addEventListener('keyup', ev => {
  const { key } = ev;
  if (!key.match('Arrow')) return;
  delete activeKeys[key];
});
document.addEventListener('keydown', ev => {
  const { key } = ev;
  if (!key.match('Arrow')) return;
  activeKeys[key] = true;
});

const move = setInterval(() => {
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
}, 15);
