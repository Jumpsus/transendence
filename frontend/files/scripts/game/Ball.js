const INITIAL_VELOCITY = 0.05;

import { gameState, gameConfig } from "../game/game.js";

export default class Ball {
  constructor(ballElem, gameField) {
    this.ballElem = ballElem;
    this.gameField = gameField;
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
    this.velocity = INITIAL_VELOCITY;
  }

  update(delta = 16, paddleRects) {
    this.x += this.direction.x * this.velocity * delta;
    this.y += this.direction.y * this.velocity * delta;
    const rect = this.rect();
    if (
      rect.bottom >= this.gameField.getBoundingClientRect().bottom ||
      rect.top <= this.gameField.getBoundingClientRect().top
    ) {
      if (gameState.isHorizontal) {
        this.direction.y *= -1;
        if (rect.bottom >= this.gameField.getBoundingClientRect().bottom) {
          this.y = 100 - gameConfig.ballWidth / 2;
        } else {
          this.y = gameConfig.ballWidth / 2;
        }
      }
    }
    if (
      rect.right >= this.gameField.getBoundingClientRect().right ||
      rect.left <= this.gameField.getBoundingClientRect().left
    ) {
      if (!gameState.isHorizontal) {
        this.direction.y *= -1;
        if (rect.right >= this.gameField.getBoundingClientRect().right) {
          this.y = gameConfig.ballWidth / 2;
        } else {
          this.y = 100 - gameConfig.ballWidth / 2;
        }
      }
    }
    if (isCollission(paddleRects[0].rect(), rect)) {
      this.x =
        gameConfig.bufferWidth +
        gameConfig.paddleWidth +
        gameConfig.ballWidth / 2;
      calculateDirection(
        { x: this.x, y: this.y },
        { x: paddleRects[0].aimX, y: paddleRects[0].aimY },
        this.direction
      );
      this.velocity = INITIAL_VELOCITY * 2;
    } else if (isCollission(paddleRects[1].rect(), rect)) {
      this.x =
        100 -
        (gameConfig.bufferWidth +
          gameConfig.paddleWidth +
          gameConfig.ballWidth / 2);
      calculateDirection(
        { x: this.x, y: this.y },
        { x: paddleRects[1].aimX, y: paddleRects[1].aimY },
        this.direction
      );
      this.velocity = INITIAL_VELOCITY * 2;
    }
  }

  // i am not sure how this should work
  async fetchUpdate() {
    await fetch("/ball")
      .then((response) => response.json())
      .then((data) => {
        this.x = data.x;
        this.y = data.y;
      });
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

function calculateDirection(ballPosition, aimPosition, ballDirection) {
  // Calculate the direction vector
  const directionX = aimPosition.x - ballPosition.x;
  const directionY = aimPosition.y - ballPosition.y;

  // Calculate the magnitude of the direction vector
  const magnitude = Math.sqrt(
    directionX * directionX + directionY * directionY
  );

  // Normalize the direction vector
  const unitDirectionX = directionX / magnitude;
  const unitDirectionY = directionY / magnitude;

  ballDirection.x = unitDirectionX;
  ballDirection.y = unitDirectionY;
}
