import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

const scoreOne = document.getElementById("score-one");
const scoreTwo = document.getElementById("score-two");
scoreOne.textContent = 0;
scoreTwo.textContent = 0;

const nameOne = document.getElementById("name-one");
const nameTwo = document.getElementById("name-two");
nameOne.textContent = "Player 1";
nameTwo.textContent = "Player 2";

export const gameField = document.getElementById("game-field");
export const gameState = {
  isHorizontal: gameField.clientWidth > gameField.clientHeight,
  isOnline: false,
};

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

window.addEventListener("keydown", (event) => {
  if (gameState.isHorizontal) {
    if (event.key === "w") {
      playerOne.y -= 10;
    }
    if (event.key === "s") {
      playerOne.y += 10;
    }
  } else {
    if (event.key === "a") {
      playerOne.y -= 10;
    }
    if (event.key === "d") {
      playerOne.y += 10;
    }
  }
});

if (!gameState.isOnline) {
  window.addEventListener("keydown", (event) => {
    if (gameState.isHorizontal) {
      if (event.key === "ArrowUp") {
        playerTwo.y -= 10;
      }
      if (event.key === "ArrowDown") {
        playerTwo.y += 10;
      }
    } else {
      if (event.key === "ArrowLeft") {
        playerTwo.y -= 10;
      }
      if (event.key === "ArrowRight") {
        playerTwo.y += 10;
      }
    }
  });
}
