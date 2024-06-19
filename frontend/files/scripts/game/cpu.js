import { gameState, gameParameters, keys } from "./setup.js";

function calcBallTrajectory(ball) {
  let futureBallX = ball.x;
  let futureBallY = ball.y;
  let velocityX = ball.velocity * ball.direction.x;
  let velocityY = ball.velocity * ball.direction.y;
  let totalTime = gameParameters.cpuUpdateTime;

  while (totalTime > 0) {
    let timeToHorizontalWall = Infinity;
    if (velocityY > 0) {
      timeToHorizontalWall = (100 - futureBallY) / velocityY;
    } else if (velocityY < 0) {
      timeToHorizontalWall = -futureBallY / velocityY;
    }

    let timeToVerticalWall = Infinity;
    if (velocityX > 0) {
      timeToVerticalWall = (100 - futureBallX) / velocityX;
    } else if (velocityX < 0) {
      timeToVerticalWall = -futureBallX / velocityX;
    }

    let nextCollisionTime = Math.min(
      timeToVerticalWall,
      timeToHorizontalWall,
      totalTime
    );
    futureBallX += velocityX * nextCollisionTime;
    futureBallY += velocityY * nextCollisionTime;
    totalTime -= nextCollisionTime;

    if (nextCollisionTime === timeToHorizontalWall) {
      velocityY *= -1;
    }

    if (nextCollisionTime === timeToVerticalWall) {
      if (futureBallX <= 0) {
        futureBallX = 0;
        break;
      } else {
        velocityX *= -1;
      }
    }
  }

  return futureBallY;
}

let lastUpdate = 0;
export function updateCPU(ball, cpu, player) {
  let ballEstY = ball.y;
  let up = "w";
  let down = "s";
  if (!gameState.isHorizontal) {
    up = "d";
    down = "a";
  }

  const now = Date.now();
  if (now - lastUpdate >= gameParameters.cpuUpdateTime || lastUpdate == 0) {
    ballEstY = calcBallTrajectory(ball, player);
    lastUpdate = now;
  }
  if (cpu.y < ballEstY) {
    keys[`${up}`] = false;
    keys[`${down}`] = true;
  } else {
    keys[`${down}`] = false;
    keys[`${up}`] = true;
  }
}
