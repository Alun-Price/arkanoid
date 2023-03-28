import { CanvasView } from "./view/CanvasView";
import { Ball } from "./sprites/Ball";
import { Brick } from "./sprites/Brick";
import { Paddle } from "./sprites/Paddle";
import { Collision } from "./Collision";

// images
import PADDLE_IMAGE from "./images/paddle.png";
import BALL_IMAGE from "./images/ball.png";

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
  paddle: Paddle,
  ball: Ball,
  collision: Collision
) {
  view.clear();
  view.drawBricks(bricks);
  view.drawSprite(paddle);
  view.drawSprite(ball);

  // Move ball
  ball.moveBall();

  // Move paddle and check it won't exit the play field
  if (
    (paddle.isMovingLeft && paddle.pos.x > 0) ||
    (paddle.isMovingRight && paddle.pos.x < view.canvas.width - paddle.width)
  ) {
    paddle.movePaddle();
  }

  collision.checkBallCollision(ball, paddle, view);
  const collidingBrick = collision.isCollidingBricks(ball, bricks);

  if (collidingBrick) {
    score += 1;
    view.drawScore(score);
  }

  // Game Over when ball leaves playField
  if (ball.pos.y > view.canvas.height) gameOver = true;
  // If game won, set gameOver and display win
  if (bricks.length === 0) return setGameWin(view);
  // Return if gameover and don't run the requestAnimationFrame
  if (gameOver) return setGameOver(view);

  requestAnimationFrame(() => gameLoop(view, bricks, paddle, ball, collision));
}

function startGame(view: CanvasView) {
  // reset the displays when start the game
  score = 0;
  view.drawInfo(""); // first in the variable
  view.drawScore(0); // show the user

  // Create a collision instance
  const collision = new Collision();

  // create all the bricks
  const bricks = createBricks();

  // create a new ball
  const ball = new Ball(
    BALL_SPEED,
    BALL_SIZE,
    {
      x: BALL_STARTX,
      y: BALL_STARTY,
    },
    BALL_IMAGE
  );

  // create a new paddle
  const paddle = new Paddle(
    PADDLE_SPEED,
    PADDLE_WIDTH,
    PADDLE_HEIGHT,
    {
      x: PADDLE_STARTX,
      y: view.canvas.height - PADDLE_HEIGHT - 5,
    },
    PADDLE_IMAGE
  );

  gameLoop(view, bricks, paddle, ball, collision);
}

// Create a new View
const view = new CanvasView("#playField");
view.initStartButton(startGame);
