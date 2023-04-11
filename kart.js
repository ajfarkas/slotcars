const SPEED = 10;

const $id = (identify) => document.getElementById(identify);
const getStyle = (value, el) =>
  getComputedStyle(el || document.documentElement)
  .getPropertyValue(value);

const world = $id("world");
const board = $id("board");

const PERSPECTIVE = parseInt(getStyle('perspective', world));
const BOARD_H = parseInt(getStyle("height", world));
const SOUTH_POINT = -2 * PERSPECTIVE;
const BOARD_TRANS = `rotateX(90deg) translateZ(${PERSPECTIVE * 2}px)`;

board.style.transform = `${BOARD_TRANS}  translateY(${SOUTH_POINT}px)`;

let NORTH = SOUTH_POINT + 0;
const maxMotion = SOUTH_POINT + BOARD_H;
const moveForward = () => {
  NORTH += SPEED;
  if (NORTH <= maxMotion) {
    board.style.transform = `${BOARD_TRANS} translateY(${NORTH}px)`;
  } else {
    clearInterval(forward);
  }
};
const forward = setInterval(moveForward, 15);
