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
  const playerOne = new Paddle(game.paddleOne, game.aimOne, 1);
  const playerTwo = new Paddle(game.paddleTwo, game.aimTwo, 2);
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
    };
    gameConfig.ws.onclose = () => {
      console.log("WebSocket closed");
    };
    function update(time) {
      if (lastTime != undefined && !gameState.isPaused) {
        const delta = time - lastTime;
        updatePaddles(delta);
        sendPaddlePos();
      }
      lastTime = time;
      window.requestAnimationFrame(update);
    }
    window.requestAnimationFrame(update);
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
          ball.reset();
          playerOne.reset();
          playerTwo.reset();
          if (gameState.score[0] == 1 || gameState.score[1] == 1) {
            gameState.isFinished = true;
          }
        }
      }
      lastTime = time;
      console.log("update");
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
    const radius = 50 - gameParameters.bufferWidth;
    const up1 = gameState.isHorizontal ? "w" : "d";
    const down1 = gameState.isHorizontal ? "s" : "a";
    const up2 = gameState.isHorizontal ? "ArrowUp" : "ArrowRight";
    const down2 = gameState.isHorizontal ? "ArrowDown" : "ArrowLeft";
    if (keys[up1]) playerOne.y -= gameParameters.playerSpeed * delta;
    if (keys[down1]) playerOne.y += gameParameters.playerSpeed * delta;
    if (keys[up2]) playerTwo.y -= gameParameters.playerSpeed * delta;
    if (keys[down2]) playerTwo.y += gameParameters.playerSpeed * delta;

    if (gameConfig.hasAim) {
      const aimUp1 = gameState.isHorizontal ? "a" : "w";
      const aimDown1 = gameState.isHorizontal ? "d" : "s";
      const aimUp2 = gameState.isHorizontal ? "ArrowLeft" : "ArrowUp";
      const aimDown2 = gameState.isHorizontal ? "ArrowRight" : "ArrowDown";
      if (keys[aimUp1]) playerOne.angle -= gameParameters.aimSpeed * delta;
      if (keys[aimDown1]) playerOne.angle += gameParameters.aimSpeed * delta;
      if (keys[aimUp2]) playerTwo.angle += gameParameters.aimSpeed * delta;
      if (keys[aimDown2]) playerTwo.angle -= gameParameters.aimSpeed * delta;
      retractAim(keys[aimUp2], keys[aimDown2], playerTwo, delta);
      retractAim(keys[aimUp1], keys[aimDown1], playerOne, delta);
      updateAim(playerOne, radius);
      updateAim(playerTwo, radius);
    }
  }

  function retractAim(left, right, player, delta) {
    if (gameConfig.isTouch) return;
    if (!left && !right && player.angle != 0) {
      if (player.angle > gameParameters.aimSpeed * delta)
        player.angle -= gameParameters.aimSpeed * delta;
      else if (player.angle < -gameParameters.aimSpeed * delta)
        player.angle += gameParameters.aimSpeed * delta;
      else player.angle = 0;
    }
  }

  function updateAim(paddle, radius) {
    let angle = (paddle.angle * Math.PI) / 180;
    if (paddle.paddleElem.id === "player-one")
      paddle.aimX = gameParameters.bufferWidth + radius * Math.cos(angle);
    else
      paddle.aimX = 100 - gameParameters.bufferWidth - radius * Math.cos(angle);
    paddle.aimY = 50 + radius * Math.sin(angle);
  }
}
