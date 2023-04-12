const SPEED = 5;
const TURN_SENSITIVITY = .2;

const $id = (identify) => document.getElementById(identify);
const getStyle = (value, el) =>
  getComputedStyle(el || document.documentElement)
  .getPropertyValue(value);

const world = $id("world");
const board = $id("board");

const PERSPECTIVE = parseInt(getStyle('perspective', world));
const BOARD_H = parseInt(getStyle("height", world));
const SOUTH_POINT = -2 * PERSPECTIVE;
const BOARD_TRANS = `rotateX(105deg) translateZ(${PERSPECTIVE * 2}px)`;

board.style.transform = `${BOARD_TRANS}  translateY(${SOUTH_POINT}px)`;

let NORTH = SOUTH_POINT + 0;
let ANGLE = 0;

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
    if (k === 'ArrowUp') {
      NORTH += SPEED;
    }
    if (k === 'ArrowLeft') {
      if (activeKeys.ArrowDown) {
        ANGLE -= TURN_SENSITIVITY;
      } else {
        ANGLE += TURN_SENSITIVITY;
      }
    };
    if (k === 'ArrowDown') {
      NORTH -= SPEED;
    };
    if (k === 'ArrowRight') {
      if (activeKeys.ArrowDown) {
        ANGLE += TURN_SENSITIVITY;
      } else {
        ANGLE -= TURN_SENSITIVITY;
      }
    };
  });

  board.style.transform = `${BOARD_TRANS} translateY(${NORTH}px) rotateZ(${ANGLE}deg)`;
}, 15);
