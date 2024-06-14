import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
import Collectible from "./Collectible.js";

export let eventListenersSet = false;

export const gameState = {
  isOn: false,
  isHorizontal: true,
  isPaused: false,
  isTouch: false,
  collectible: null,
  powerUp: { effect: null, player: null },
};

export const gameConfig = {
  isOnline: false,
  roomId: null,
  ws: null,
  hasCPU: false,
  hasPowerUps: false,
  hasAim: false,
  CPULevel: 1,
  paddleWidth: 2,
  paddleHeight: 20,
  ballWidth: 3,
  bufferWidth: 2,
  ballSpeed1: 0.1,
  ballSpeed2: 0.1,
  collectibleChance: 100,
};

function setDimensions() {
  const root = document.documentElement;
  root.style.setProperty("--paddleWidth", `${gameConfig.paddleWidth}`);
  root.style.setProperty("--paddleHeight", `${gameConfig.paddleHeight}`);
  root.style.setProperty("--ballWidth", `${gameConfig.ballWidth}`);
  root.style.setProperty("--bufferWidth", `${gameConfig.bufferWidth}`);
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

export function init() {
  setDimensions();
  gameState.isTouch = isTouchDevice();
  const scoreOne = document.getElementById("score-one");
  const scoreTwo = document.getElementById("score-two");
  scoreOne.textContent = "00";
  scoreTwo.textContent = "00";

  const nameOne = document.getElementById("name-one");
  const nameTwo = document.getElementById("name-two");
  const homeNav = document.getElementById("navigation-wrapper");
  nameOne.textContent = "P1";
  nameTwo.textContent = "P2";
  let playerOneScore = 0;
  let playerTwoScore = 0;

  const pauseArea = document.getElementById("pause-area");
  const pauseText = document.getElementById("pause-text");
  homeNav.classList.toggle("hidden");

  const PLAYER_SPEED = 0.1;
  const AIM_SPEED = 0.2;
  const CPU_TIME_TO_UPDATE = 1000;

  function setFieldBorders() {
    let borderWidth;
    if (
      gameState.isHorizontal &&
      gameContainer.offsetHeight != gameField.offsetHeight
    ) {
      borderWidth = gameContainer.offsetHeight / 80;
      gameField.style.setProperty(
        "border-top",
        `${borderWidth}px solid var(--game-ui-color)`
      );
      gameField.style.setProperty(
        "border-bottom",
        `${borderWidth}px solid var(--game-ui-color)`
      );
      gameField.style.setProperty("border-left", "none");
      gameField.style.setProperty("border-right", "none");
    } else if (
      !gameState.isHorizontal &&
      gameContainer.offsetWidth != gameField.offsetWidth
    ) {
      borderWidth = gameContainer.offsetWidth / 50;
      gameField.style.setProperty(
        "border-left",
        `${borderWidth}px solid var(--game-ui-color)`
      );
      gameField.style.setProperty(
        "border-right",
        `${borderWidth}px solid var(--game-ui-color)`
      );
      gameField.style.setProperty("border-top", "none");
      gameField.style.setProperty("border-bottom", "none");
    } else {
      gameField.style.setProperty("border", "none");
    }
  }

  const gameContainer = document.getElementById("game-container");
  const gameField = document.getElementById("game-field");
  gameState.isHorizontal = gameField.clientWidth > gameField.clientHeight;
  gameState.isPaused = false;

  const keys = {};
  const ball = new Ball(document.getElementById("ball"), gameField);
  const playerOne = new Paddle(
    document.getElementById("player-one"),
    document.getElementById("aim-two")
  );
  const playerTwo = new Paddle(
    document.getElementById("player-two"),
    document.getElementById("aim-one")
  );

  setFieldBorders();

  window.addEventListener("resize", () => {
    gameState.isHorizontal = gameField.clientWidth > gameField.clientHeight;
    setFieldBorders();
  });

  function sendPaddlePos() {
    const message = JSON.stringify({
		paddle_vel: playerOne.y,
    });
    console.log(message);
    gameConfig.ws.send(message);
  }

  if (gameConfig.isOnline) {
    gameConfig.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("recieved data:");
      console.log(data);
    };
    console.log(gameConfig.ws);
    gameConfig.ws.onclose = () => {
      console.log("WebSocket closed");
    };
    setTimeout(() => {
      sendPaddlePos();
    }, 16);
  }

  if (!gameConfig.isOnline) {
    let lastTime;
    function update(time) {
      if (lastTime != undefined && !gameState.isPaused) {
        const delta = time - lastTime;
        // debugConsole.textContent = delta;
        updatePaddles(delta);
        ball.update(delta, [playerOne, playerTwo]);
        if (gameState.powerUp.effect) {
          applyPowerUp();
        }
        if (gameConfig.hasCPU) updateCPU(delta);
        if (isLose()) {
          ball.reset();
          playerOne.reset();
          playerTwo.reset();
          const chance = Math.random();
          if (
            !gameState.collectible &&
            chance < gameConfig.collectibleChance / 100
          ) {
            gameState.collectible = new Collectible(gameField);
          }
        }
      }
      lastTime = time;
      window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);
  }

  function applyPowerUp() {
    let saveConfig = { ...gameConfig };
    console.log("applying powerup");
    switch (gameState.powerUp.effect) {
      case "speedy":
        if (gameState.powerUp.player === 1) gameConfig.ballSpeed1 *= 2;
        else if (gameState.powerUp.player === 2) gameConfig.ballSpeed2 *= 2;
        break;
      case "paddleReducer":
        if (gameState.powerUp.player === 1)
          playerTwo.paddleElem.style.setProperty(
            "--paddleHeight",
            `${gameConfig.paddleHeight / 2}`
          );
        else if (gameState.powerUp.player === 2)
          playerOne.paddleElem.style.setProperty(
            "--paddleHeight",
            `${gameConfig.paddleHeight / 2}`
          );
        break;
      case "paddleEnlarger":
        if (gameState.powerUp.player === 1)
          playerOne.paddleElem.style.setProperty(
            "--paddleHeight",
            `${gameConfig.paddleHeight * 2}`
          );
        else if (gameState.powerUp.player === 2)
          playerTwo.paddleElem.style.setProperty(
            "--paddleHeight",
            `${gameConfig.paddleHeight * 2}`
          );
        break;
      default:
        break;
    }
    gameState.powerUp.effect = null;
    gameState.powerUp.player = null;
    setTimeout(() => {
      Object.assign(gameConfig, saveConfig);
      playerOne.paddleElem.style.setProperty(
        "--paddleHeight",
        `${gameConfig.paddleHeight}`
      );
      playerTwo.paddleElem.style.setProperty(
        "--paddleHeight",
        `${gameConfig.paddleHeight}`
      );
    }, 5000);
  }

  function isLose() {
    if (ball.x <= 0) {
      playerTwoScore++;
      scoreTwo.textContent = playerTwoScore.toString().padStart(2, "0");
      return true;
    }
    if (ball.x >= 100) {
      playerOneScore++;
      scoreOne.textContent = playerOneScore.toString().padStart(2, "0");
      return true;
    }
  }
  playerOne.angle = 0;
  playerTwo.angle = 0;
  function updatePaddles(delta) {
    const radius = 50 - gameConfig.bufferWidth;
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
      if (keys["a"]) {
        playerOne.angle -= AIM_SPEED * delta;
      }
      if (keys["d"]) {
        playerOne.angle += AIM_SPEED * delta;
      }
      if (keys["ArrowLeft"]) {
        playerTwo.angle += AIM_SPEED * delta;
      }
      if (keys["ArrowRight"]) {
        playerTwo.angle -= AIM_SPEED * delta;
      }
      retractAim(keys["ArrowLeft"], keys["ArrowRight"], playerTwo);
      retractAim(keys["a"], keys["d"], playerOne);
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
      if (keys["ArrowUp"]) {
        playerTwo.angle -= AIM_SPEED * delta;
      }
      if (keys["ArrowDown"]) {
        playerTwo.angle += AIM_SPEED * delta;
      }
      if (keys["w"]) {
        playerOne.angle += AIM_SPEED * delta;
      }
      if (keys["s"]) {
        playerOne.angle -= AIM_SPEED * delta;
      }
      retractAim(keys["ArrowUp"], keys["ArrowDown"], playerTwo);
      retractAim(keys["w"], keys["s"], playerOne);
    }
    playerOne.y = Math.max(10, Math.min(playerOne.y, 90));
    playerTwo.y = Math.max(10, Math.min(playerTwo.y, 90));
    updateAim(playerOne, radius);
    updateAim(playerTwo, radius);
    function retractAim(left, right, player) {
      if (gameState.isTouch) return;
      if (!left && !right && player.angle != 0) {
        if (player.angle > AIM_SPEED * delta) player.angle -= AIM_SPEED * delta;
        else if (player.angle < -AIM_SPEED * delta)
          player.angle += AIM_SPEED * delta;
        else player.angle = 0;
      }
    }
  }

  function toRadians(angle) {
    return (angle * Math.PI) / 180;
  }

  function updateAim(paddle, radius) {
    let angle = toRadians(paddle.angle);
    if (paddle.paddleElem.id === "player-one")
      paddle.aimX = gameConfig.bufferWidth + radius * Math.cos(angle);
    else paddle.aimX = 100 - gameConfig.bufferWidth - radius * Math.cos(angle);
    paddle.aimY = 50 + radius * Math.sin(angle);
  }

  window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
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
  }

  let pauseInterval;
  function pauseGame() {
    gameState.isPaused = !gameState.isPaused;
    const pauseText = document.getElementById("pause-text");
    const gameField = document.getElementById("game-field");
    if (gameState.isPaused) {
      pauseText.classList.add("show");
      gameField.classList.add("paused");
      homeNav.classList.remove("hidden");
      pauseInterval = setInterval(() => {
        pauseText.classList.toggle("show");
      }, 1000);
    } else {
      clearInterval(pauseInterval);
      pauseText.classList.remove("show");
      gameField.classList.remove("paused");
      homeNav.classList.add("hidden");
    }
    setTimeout(() => {
      setFieldBorders();
    }, 300);
  }

  if (!eventListenersSet) {
    document.addEventListener("keydown", (event) => {
      if (event.key === " ") {
        pauseGame();
      }
    });
    eventListenersSet = true;
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
        moveAim(playerOne, touch.clientY);
      } else if (touch.identifier === paddle2TouchId) {
        movePaddle(playerTwo, touch.clientX);
        moveAim(playerTwo, touch.clientY);
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

  function moveAim(paddle, x) {
    const gameRect = gameContainer.getBoundingClientRect();
    if (paddle.paddleElem.id === "player-one") {
      const playerZone = paddle.rect().top * 2;
      if (x < gameRect.top + playerZone && x > gameRect.top) {
        x = playerZone / 2 - (x - gameRect.top);
        paddle.angle = -(x / playerZone) * 2 * 100;
      }
    } else {
      const playerZone = (gameRect.bottom - paddle.rect().bottom) * 2;
      if (x > gameRect.bottom - playerZone && x < gameRect.bottom) {
        x = playerZone / 2 - (gameRect.bottom - x);
        paddle.angle = (x / playerZone) * 2 * 100;
      }
    }
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
