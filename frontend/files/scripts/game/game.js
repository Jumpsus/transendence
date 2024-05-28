import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const scoreOne = document.getElementById("score-one");
const scoreTwo = document.getElementById("score-two");
scoreOne.textContent = 0;
scoreTwo.textContent = 0;

const nameOne = document.getElementById("name-one");
const nameTwo = document.getElementById("name-two");
nameOne.textContent = "Player1";
nameTwo.textContent = "Player2";

export const gameField = document.getElementById("game-field");
export const gameState = {
  isHorizontal: gameField.clientWidth > gameField.clientHeight,
  isOnline: false,
};

const keys = {};
const ball = new Ball(document.getElementById("ball"));
const playerOne = new Paddle(document.getElementById("player-one"));
const playerTwo = new Paddle(document.getElementById("player-two"));

window.addEventListener("resize", () => {
  gameState.isHorizontal = gameField.clientWidth > gameField.clientHeight;
});

if (gameState.isOnline) {
  setInterval(async () => {
    await playerOne.sendUpdate();
    await ball.fetchUpdate();
    await playerTwo.fetchUpdate();
  }, 16);
} else {
  let lastTime;
  function update(time) {
    if (lastTime != undefined) {
      const delta = time - lastTime;
      updatePaddles();
      ball.update(delta, [playerOne.rect(), playerTwo.rect()]);
      if (isLose()) {
        ball.reset();
        playerOne.reset();
        playerTwo.reset();
      }
    }
    lastTime = time;
    window.requestAnimationFrame(update);
  }
  window.requestAnimationFrame(update);
}

function isLose() {
  const rect = ball.rect();
  if (gameState.isHorizontal) {
    return (
      rect.right >= gameField.getBoundingClientRect().right ||
      rect.left <= gameField.getBoundingClientRect().left
    );
  } else {
    return (
      rect.bottom >= gameField.getBoundingClientRect().bottom ||
      rect.top <= gameField.getBoundingClientRect().top
    );
  }
}

function updatePaddles() {
  if (gameState.isHorizontal) {
    if (keys["w"]) {
      playerOne.y -= 1;
    }
    if (keys["s"]) {
      playerOne.y += 1;
    }
    if (keys["ArrowUp"]) {
      playerTwo.y -= 1;
    }
    if (keys["ArrowDown"]) {
      playerTwo.y += 1;
    }
  } else {
    if (keys["a"]) {
      playerOne.y -= 1;
    }
    if (keys["d"]) {
      playerOne.y += 1;
    }
    if (keys["ArrowLeft"]) {
      playerTwo.y -= 1;
    }
    if (keys["ArrowRight"]) {
      playerTwo.y += 1;
    }
  }
}

window.addEventListener("keydown", (event) => {
  if (gameState.isHorizontal) {
    if (
      (!gameState.isOnline &&
        (event.key === "ArrowUp" || event.key === "ArrowDown")) ||
      event.key === "w" ||
      event.key === "s"
    )
      keys[event.key] = true;
  } else {
    if (
      (!gameState.isOnline &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")) ||
      event.key === "a" ||
      event.key === "d"
    ) {
      keys[event.key] = true;
    }
  }
});

window.addEventListener("keyup", (event) => {
  if (gameState.isHorizontal) {
    if (
      (!gameState.isOnline &&
        (event.key === "ArrowUp" || event.key === "ArrowDown")) ||
      event.key === "w" ||
      event.key === "s"
    )
      keys[event.key] = false;
  } else {
    if (
      (!gameState.isOnline &&
        (event.key === "ArrowLeft" || event.key === "ArrowRight")) ||
      event.key === "a" ||
      event.key === "d"
    ) {
      keys[event.key] = false;
    }
  }
});
