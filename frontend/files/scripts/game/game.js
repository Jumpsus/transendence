import Ball from "./Ball.js";
import Paddle from "./Paddle.js";

export const gameState = {
  isHorizontal: true,
  isOnline: false,
  isPaused: false,
  hasCPU: false,
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
        console.log(playerOne.y, playerTwo.y);
        ball.update(delta, [playerOne.rect(), playerTwo.rect()]);
        if (gameState.hasCPU) updateCPU();
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
        playerOne.y += PLAYER_SPEED;
      }
      if (keys["d"]) {
        playerOne.y -= PLAYER_SPEED;
      }
      if (keys["ArrowLeft"]) {
        playerTwo.y += PLAYER_SPEED;
      }
      if (keys["ArrowRight"]) {
        playerTwo.y -= PLAYER_SPEED;
      }
    }
    playerOne.y = Math.max(10, Math.min(playerOne.y, 90));
    playerTwo.y = Math.max(10, Math.min(playerTwo.y, 90));
  }

  window.addEventListener("keydown", (event) => {
    if (gameState.isHorizontal) {
      if (
        (!gameState.isOnline &&
          !gameState.hasCPU &&
          (event.key === "w" || event.key === "s")) ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      )
        keys[event.key] = true;
    } else {
      if (
        (!gameState.isOnline &&
          !gameState.hasCPU &&
          (event.key === "a" || event.key === "d")) ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        keys[event.key] = true;
      }
    }
  });

  window.addEventListener("keyup", (event) => {
    if (gameState.isHorizontal) {
      if (
        (!gameState.isOnline &&
          !gameState.hasCPU &&
          (event.key === "w" || event.key === "s")) ||
        event.key === "ArrowUp" ||
        event.key === "ArrowDown"
      )
        keys[event.key] = false;
    } else {
      if (
        (!gameState.isOnline &&
          !gameState.hasCPU &&
          (event.key === "a" || event.key === "d")) ||
        event.key === "ArrowLeft" ||
        event.key === "ArrowRight"
      ) {
        keys[event.key] = false;
      }
    }
  });

//   function updateCPU() {
//     let up = "w";
//     let down = "s";
//     if (!gameState.isHorizontal) {
//       up = "d";
//       down = "a";
//     }
//     setTimeout(() => {
//       if (playerOne.y < ball.y) {
//         keys[`${up}`] = false;
//         keys[`${down}`] = true;
//       } else {
//         keys[`${down}`] = false;
//         keys[`${up}`] = true;
//       }
//     }, 1);
//   }

    function updateCPU() {
      // Randomize delay to simulate human reaction time
      const delay = Math.random() * 200 + 300; // Random delay between 300ms and 500ms

      setTimeout(() => {
        // Calculate a small offset to simulate human inaccuracy
        const offset = Math.random() * 10 - 5; // Random offset between -5 and 5

        let up = "w";
        let down = "s";
        if (!gameState.isHorizontal) {
          up = "d";
          down = "a";
        }
        if (playerOne.y < ball.y + offset) {
          keys[`${up}`] = false;
          keys[`${down}`] = true;
        } else {
          keys[`${down}`] = false;
          keys[`${up}`] = true;
        }

        // Randomize the duration for how long a key is held down
        const holdTime = Math.random() * 300 + 200; // Random hold time between 200ms and 500ms

        // After the hold time, stop the key press to simulate a real player releasing the key
        setTimeout(() => {
          keys[`${up}`] = false;
          keys[`${down}`] = false;

          // Continue updating the CPU's movements
        }, holdTime);
      }, delay);
    }

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

  let paddle1TouchId = null;
  let paddle2TouchId = null;

  function handleTouchStart(event) {
    for (let touch of event.changedTouches) {
      if (touch.clientY < window.innerHeight / 2) {
        if (paddle1TouchId === null) {
          paddle1TouchId = touch.identifier;
        }
      } else {
        if (paddle2TouchId === null) {
          paddle2TouchId = touch.identifier;
        }
      }
    }
  }

  function handleTouchMove(event) {
    for (let touch of event.changedTouches) {
      if (touch.identifier === paddle1TouchId) {
        movePaddle(playerOne, touch.clientX);
      } else if (touch.identifier === paddle2TouchId) {
        movePaddle(playerTwo, touch.clientX);
      }
    }
  }

  function handleTouchEnd(event) {
    for (let touch of event.changedTouches) {
      if (touch.identifier === paddle1TouchId) {
        paddle1TouchId = null;
      } else if (touch.identifier === paddle2TouchId) {
        paddle2TouchId = null;
      }
    }
  }

  function movePaddle(paddle, y) {
    const yPercent = (y / window.innerWidth) * 100;
    paddle.y = yPercent;
  }

  const options = { passive: true };
  gameField.addEventListener("touchstart", handleTouchStart, options);
  gameField.addEventListener("touchmove", handleTouchMove, options);
  gameField.addEventListener("touchend", handleTouchEnd, options);
  gameField.addEventListener("touchcancel", handleTouchEnd, options);
  document.addEventListener("gesturestart", function (e) {
    e.preventDefault();
  });

  document.addEventListener("gesturechange", function (e) {
    e.preventDefault();
  });

  document.addEventListener("gestureend", function (e) {
    e.preventDefault();
  });
}
