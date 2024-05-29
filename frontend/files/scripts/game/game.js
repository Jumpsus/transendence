import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

export const gameState = {
  isHorizontal: true,
  isOnline: false,
  isPaused: false,
};

export function init() {
  const scoreOne = document.getElementById("score-one");
  const scoreTwo = document.getElementById("score-two");
  scoreOne.textContent = 0;
  scoreTwo.textContent = 0;

  const nameOne = document.getElementById("name-one");
  const nameTwo = document.getElementById("name-two");
  const homeNav = document.getElementById("navigation-wrapper");
  nameOne.textContent = "Player1";
  nameTwo.textContent = "Player2";

  const pauseArea = document.getElementById("pause-area");
  homeNav.classList.toggle("hidden");

  const PLAYER_SPEED = 1;

  function setFieldBorders() {
    if (gameContainer.offsetWidth == gameField.offsetWidth) {
      gameField.style.setProperty("border-left", "none");
      gameField.style.setProperty("border-right", "none");
      gameField.style.setProperty(
        "border-top",
        "3px solid var(--game-ui-color)"
      );
      gameField.style.setProperty(
        "border-bottom",
        "3px solid var(--game-ui-color)"
      );
    } else if (gameContainer.offsetHeight == gameField.offsetHeight) {
      gameField.style.setProperty("border-top", "none");
      gameField.style.setProperty("border-bottom", "none");
      gameField.style.setProperty(
        "border-left",
        "3px solid var(--game-ui-color)"
      );
      gameField.style.setProperty(
        "border-right",
        "3px solid var(--game-ui-color)"
      );
    } else {
      gameField.style.removeProperty("border-top");
      gameField.style.removeProperty("border-bottom");
      gameField.style.removeProperty("border-left");
      gameField.style.removeProperty("border-right");
      gameField.style.setProperty("border", "3px solid var(--game-ui-color)");
    }
  }

  const gameContainer = document.getElementById("game-container");
  const gameField = document.getElementById("game-field");
  gameState.isHorizontal = gameField.clientWidth > gameField.clientHeight;
  gameState.isOnline = false;
  gameState.isPaused = false;

  const keys = {};
  const ball = new Ball(document.getElementById("ball"), gameField);
  const playerOne = new Paddle(document.getElementById("player-one"));
  const playerTwo = new Paddle(document.getElementById("player-two"));

  setFieldBorders();

  window.addEventListener("resize", () => {
    gameState.isHorizontal = gameField.clientWidth > gameField.clientHeight;
    setFieldBorders();
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
      if (lastTime != undefined && !gameState.isPaused) {
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
        playerOne.y -= PLAYER_SPEED;
      }
      if (keys["s"]) {
        playerOne.y += PLAYER_SPEED;
      }
      if (keys["ArrowUp"]) {
        playerTwo.y -= PLAYER_SPEED;
      }
      if (keys["ArrowDown"]) {
        playerTwo.y += PLAYER_SPEED;
      }
    } else {
      if (keys["a"]) {
        playerOne.y -= PLAYER_SPEED;
      }
      if (keys["d"]) {
        playerOne.y += PLAYER_SPEED;
      }
      if (keys["ArrowLeft"]) {
        playerTwo.y -= PLAYER_SPEED;
      }
      if (keys["ArrowRight"]) {
        playerTwo.y += PLAYER_SPEED;
      }
    }
    playerOne.y = Math.max(10, Math.min(playerOne.y, 90));
    playerTwo.y = Math.max(10, Math.min(playerTwo.y, 90));
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

  function pauseGame() {
    gameState.isPaused = !gameState.isPaused;
    homeNav.classList.toggle("hidden");
    setTimeout(() => {
      setFieldBorders();
    }, 300);
  }

  pauseArea.addEventListener("click", () => {
    pauseGame();
  });
}
