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

  const PLAYER_SPEED = 0.1;
  const CPU_TIME_TO_UPDATE = 1000;

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

  const debugConsole = document.querySelector("#debug-console");

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
        debugConsole.textContent = delta;
        updatePaddles(delta);
        ball.update(delta, [playerOne.rect(), playerTwo.rect()]);
        if (gameState.hasCPU) updateCPU(delta);
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

  function updatePaddles(delta) {
    if (gameState.isHorizontal) {
      if (keys["w"]) {
        playerOne.y -= PLAYER_SPEED * delta;
      }
      if (keys["s"]) {
        playerOne.y += PLAYER_SPEED * delta;
      }
      if (keys["ArrowUp"]) {
        playerTwo.y -= PLAYER_SPEED * delta;
      }
      if (keys["ArrowDown"]) {
        playerTwo.y += PLAYER_SPEED * delta;
      }
    } else {
      if (keys["a"]) {
        playerOne.y += PLAYER_SPEED * delta;
      }
      if (keys["d"]) {
        playerOne.y -= PLAYER_SPEED * delta;
      }
      if (keys["ArrowLeft"]) {
        playerTwo.y += PLAYER_SPEED * delta;
      }
      if (keys["ArrowRight"]) {
        playerTwo.y -= PLAYER_SPEED * delta;
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

  function calcBallTrajectory(delta) {
    let futureBallX = ball.x;
    let futureBallY = ball.y;
    let velocityX = ball.velocity * ball.direction.x;
    let velocityY = ball.velocity * ball.direction.y;
    let totalTime = CPU_TIME_TO_UPDATE;

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
  let ballEstY = ball.y;
  function updateCPU(delta) {
    let up = "w";
    let down = "s";
    if (!gameState.isHorizontal) {
      up = "d";
      down = "a";
    }

    const now = Date.now();
    if (now - lastUpdate >= CPU_TIME_TO_UPDATE || lastUpdate == 0) {
      ballEstY = calcBallTrajectory(delta);
      lastUpdate = now;
    }
    if (playerOne.y < ballEstY) {
      keys[`${up}`] = false;
      keys[`${down}`] = true;
    } else {
      keys[`${down}`] = false;
      keys[`${up}`] = true;
    }

    // // Randomize the duration for how long a key is held down
    // const holdTime = Math.random() * 300 + 200; // Random hold time between 200ms and 500ms

    // // After the hold time, stop the key press to simulate a real player releasing the key
    // setTimeout(() => {
    //   keys[`${up}`] = false;
    //   keys[`${down}`] = false;

    //   // Continue updating the CPU's movements
    // }, holdTime);
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
    const yPercent = ((window.innerWidth - y) / window.innerWidth) * 100;
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
