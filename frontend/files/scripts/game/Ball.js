import { gameState, gameParameters, game, gameConfig } from "./setup.js";

export default class Ball {
  constructor(ballElem) {
    this.ballElem = ballElem;
    this.reset();
  }

  get x() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--x"));
  }
  set x(value) {
    this.ballElem.style.setProperty("--x", value);
  }
  get y() {
    return parseFloat(getComputedStyle(this.ballElem).getPropertyValue("--y"));
  }
  set y(value) {
    this.ballElem.style.setProperty("--y", value);
  }

  rect() {
    return this.ballElem.getBoundingClientRect();
  }

  reset() {
    this.x = 50;
    this.y = 50;
    if (gameState.isOnline) return;
    this.direction = { x: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const heading = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
    this.velocity = gameParameters.ballSpeed / 2;
  }

  update(delta = 16, paddles) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    const rect = this.rect();
    if (
      rect.bottom >= game.field.getBoundingClientRect().bottom ||
      rect.top <= game.field.getBoundingClientRect().top
    ) {
      if (gameState.isHorizontal) {
        this.direction.y *= -1;
        if (rect.bottom >= game.field.getBoundingClientRect().bottom) {
          this.y = 100 - gameParameters.ballWidth / 2;
        } else {
          this.y = gameParameters.ballWidth / 2;
        }
      }
    }
    if (
      rect.right >= game.field.getBoundingClientRect().right ||
      rect.left <= game.field.getBoundingClientRect().left
    ) {
      if (!gameState.isHorizontal) {
        this.direction.y *= -1;
        if (rect.right >= game.field.getBoundingClientRect().right) {
          this.y = gameParameters.ballWidth / 2;
        } else {
          this.y = 100 - gameParameters.ballWidth / 2;
        }
      }
    }
    let aim;
    if (isCollission(paddles[0].rect(), rect)) {
      this.x =
        gameParameters.bufferWidth +
        gameParameters.paddleWidth +
        gameParameters.ballWidth / 2;
      if (gameConfig.hasAim) aim = { x: paddles[0].aimX, y: paddles[0].aimY };
      calculateDirection(
        { x: this.x, y: this.y },
        aim,
        this.direction,
        paddles[0]
      );
      this.velocity = gameParameters.ballSpeed;
    } else if (isCollission(paddles[1].rect(), rect)) {
      this.x =
        100 -
        (gameParameters.bufferWidth +
          gameParameters.paddleWidth +
          gameParameters.ballWidth / 2);
      if (gameConfig.hasAim) aim = { x: paddles[1].aimX, y: paddles[1].aimY };
      calculateDirection(
        { x: this.x, y: this.y },
        aim,
        this.direction,
        paddles[1]
      );
      this.velocity = gameParameters.ballSpeed;
    }
  }
}

function randomNumberBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function isCollission(rect1, rect2) {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}

function calculateDirection(ballPosition, aimPosition, ballDirection, paddle) {
  if (!aimPosition) {
    let hitPosition =
      ((ballPosition.y - paddle.y) * 2) / gameParameters.paddleHeight;
    hitPosition = Math.min(Math.max(hitPosition, -1), 1);
    let maxBounceAngle = (60 * Math.PI) / 180;
    let reflectionAngle = hitPosition * maxBounceAngle;
    let speed = Math.sqrt(
      ballDirection.x * ballDirection.x + ballDirection.y * ballDirection.y
    );
    ballDirection.y = speed * Math.sin(reflectionAngle);
    ballDirection.x = -speed * Math.cos(reflectionAngle);
    if (paddle.id == 1) {
      ballDirection.x *= -1;
    }
    return;
  } else {
    const directionX = aimPosition.x - ballPosition.x;
    const directionY = aimPosition.y - ballPosition.y;
    const magnitude = Math.sqrt(
      directionX * directionX + directionY * directionY
    );
    const unitDirectionX = directionX / magnitude;
    const unitDirectionY = directionY / magnitude;
    ballDirection.x = unitDirectionX;
    ballDirection.y = unitDirectionY;
  }
}
