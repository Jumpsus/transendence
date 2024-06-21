import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
import { setupControls } from "./controls.js";
import { updateCPU } from "./cpu.js";
import {
  setupGame,
  updateScore,
  gameState,
  gameConfig,
  gameParameters,
  online,
  game,
  keys,
} from "./setup.js";

export function init() {
  setupGame();
  const ball = new Ball(game.ball);
  const playerOne = new Paddle(game.paddleOne, 1);
  const playerTwo = new Paddle(game.paddleTwo, 2);
  setupControls(playerOne, playerTwo);
  function sendPaddlePos() {
    let pos;
    if (online.myID == 1) pos = playerOne.y;
    else pos = playerTwo.y;
    const message = JSON.stringify({
      paddle_pos: pos,
    });
    gameConfig.ws.send(message);
  }

  if (gameConfig.isOnline) {
    let lastTime;
    gameConfig.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!online.myID) {
        online.myID = data.player_id;
        online.theirID = online.myID == 1 ? 2 : 1;
      }
      ball.x = data.ball_pos[0];
      ball.y = data.ball_pos[1];
      playerOne.y = data.paddle_pos[0];
      playerTwo.y = data.paddle_pos[1];
      playerOne.update();
      playerTwo.update();
      gameState.score[0] = data.score[0];
      gameState.score[1] = data.score[1];
      updateScore();
    };
    gameConfig.ws.onclose = (event) => {
      console.log(event.code);
      if(event.code == 4101) {
        game.field.classList.add("paused");
        document.getElementById("game-over").classList.remove("d-none");
        document.getElementById("winner-name").innerText = playerOne.score > playerTwo.score ? gameConfig.names[0] : gameConfig.names[1];
        cancelAnimationFrame(gameConfig.animationID);
      }
      return;
    };
    function update(time) {
      if (lastTime != undefined && !gameState.isPaused) {
        const delta = time - lastTime;
        updatePaddles(delta);
        sendPaddlePos();
      }
      lastTime = time;
      gameConfig.animationID = window.requestAnimationFrame(update);
    }
    gameConfig.animationID = window.requestAnimationFrame(update);
  }
  if (!gameConfig.isOnline) {
    let lastTime;
    function update(time) {
      if (lastTime != undefined && !gameState.isPaused) {
        const delta = time - lastTime;
        updatePaddles(delta);
        ball.update(delta, [playerOne, playerTwo]);
        if (gameConfig.hasCPU) updateCPU(ball, playerOne, playerTwo);
        if (isLose()) {
          updateScore();
          if (gameState.score[0] == 11 || gameState.score[1] == 11) {
            ball.x = -100;
            ball.y = -100;
            gameState.isFinished = true;
          } else {
            ball.reset();
            playerOne.reset();
            playerTwo.reset();
          }
        }
      }
      lastTime = time;
      if (gameState.isFinished) gameover();
      else gameConfig.animationID = window.requestAnimationFrame(update);
    }
    gameConfig.animationID = window.requestAnimationFrame(update);
  }

  function isLose() {
    if (ball.x <= 0) {
      gameState.score[1]++;
      return true;
    }
    if (ball.x >= 100) {
      gameState.score[0]++;
      return true;
    }
    return false;
  }

  function gameover() {
    game.field.classList.add("paused");
    document.getElementById("game-over").classList.remove("d-none");
    const winner =
      gameState.score[0] > gameState.score[1]
        ? gameConfig.names[0]
        : gameConfig.names[1];
    document.getElementById("winner-name").innerText = winner;
    cancelAnimationFrame(gameConfig.animationID);
    return;
  }

  function updatePaddles(delta) {
    const up1 = gameState.isHorizontal ? "w" : "d";
    const down1 = gameState.isHorizontal ? "s" : "a";
    const up2 = gameState.isHorizontal ? "ArrowUp" : "ArrowRight";
    const down2 = gameState.isHorizontal ? "ArrowDown" : "ArrowLeft";
    if (keys[up1]) playerOne.y -= gameParameters.playerSpeed * delta;
    if (keys[down1]) playerOne.y += gameParameters.playerSpeed * delta;
    if (keys[up2]) playerTwo.y -= gameParameters.playerSpeed * delta;
    if (keys[down2]) playerTwo.y += gameParameters.playerSpeed * delta;
  }
}
