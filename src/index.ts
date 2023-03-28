// level and colours
import {
  PADDLE_SPEED,
  PADDLE_WIDTH,
  PADDLE_HEIGHT,
  PADDLE_STARTX,
  BALL_SPEED,
  BALL_SIZE,
  BALL_STARTX,
  BALL_STARTY,
} from "./setup";
import { CanvasView } from "./view/CanvasView";
import { Ball } from "./sprites/Ball";
import { Brick } from "./sprites/Brick";
import { Paddle } from "./sprites/Paddle";

// images
import PADDLE_IMAGE from "./images/paddle.png";
import BALL_IMAGE from "./images/ball.png";

// Helpers
import { createBricks } from "./helpers";

let gameOver = false;
let score = 0;

function setGameOver(view: CanvasView) {
  view.drawInfo("GAME OVER!!");
  gameOver = false;
}

function setGameWin(view: CanvasView) {
  view.drawInfo("YOU WIN!!");
  gameOver = false;
}

function gameLoop(
  view: CanvasView,
  bricks: Brick[],
  paddle: Paddle
  //ball: Ball
) {
  view.clear();
  view.drawBricks(bricks);
  view.drawSprite(paddle);

  // Move paddle and check it won't exit the play field
  if (
    (paddle.isMovingLeft && paddle.pos.x > 0) ||
    (paddle.isMovingRight && paddle.pos.x < view.canvas.width - paddle.width)
  ) {
    paddle.movePaddle();
  }
  requestAnimationFrame(() => gameLoop(view, bricks, paddle));
}

function startGame(view: CanvasView) {
  // reset the displays when start the game
  score = 0;
  view.drawInfo(""); // first in the variable
  view.drawScore(0); // show the user

  // create all the bricks
  const bricks = createBricks();

  // create a new paddle
  const paddle = new Paddle(
    PADDLE_SPEED,
    PADDLE_HEIGHT,
    PADDLE_WIDTH,
    {
      x: PADDLE_STARTX,
      y: view.canvas.height - PADDLE_HEIGHT - 5,
    },
    PADDLE_IMAGE
  );

  gameLoop(view, bricks, paddle);
}

// Create a new View
const view = new CanvasView("#playField");
view.initStartButton(startGame);
