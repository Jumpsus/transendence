import Ball from "./Ball.js";
import Paddle from "./Paddle.js";
import { setupControls } from "./controls.js";
import { updateCPU } from "./cpu.js";
import { cup } from "../views/tournament.js";
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
import { pushHistoryAndGoTo, replaceHistoryAndGoTo } from "../utils/router.js";

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
    if (!gameConfig.ws || gameConfig.ws.readyState != WebSocket.OPEN) return;
    gameConfig.ws.send(message);
  }

  if (gameConfig.isOnline) {
    let lastTime;
    if (gameConfig.isTouch) {
      const touchInstructions = document.querySelectorAll(".not-touch-instr");
      for (let instr of touchInstructions) instr.classList.add("d-none");
    }
    const instructionLeft = document.getElementById("instructions-left");
    const instructionRight = document.getElementById("instructions-right");
    gameConfig.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (!online.myID) {
        online.myID = data.player_id;
        online.theirID = online.myID == 1 ? 2 : 1;
        if (online.myID == 1) {
          instructionLeft.classList.remove("d-none");
          setTimeout(() => {
            instructionLeft.classList.add("remove");
          }, 3000);
        } else {
          instructionRight.classList.remove("d-none");
          setTimeout(() => {
            instructionRight.classList.add("remove");
          }, 3000);
        }
      }
      ball.x = data.ball_pos[0];
      ball.y = data.ball_pos[1];
      playerOne.y = data.paddle_pos[0];
      playerTwo.y = data.paddle_pos[1];
      gameConfig.names[0] = data.player_names[0];
      gameConfig.names[1] = data.player_names[1];
      document.getElementById("name-one").innerText = gameConfig.names[0];
      document.getElementById("name-two").innerText = gameConfig.names[1];
      playerOne.update();
      playerTwo.update();
      gameState.score[0] = data.score[0];
      gameState.score[1] = data.score[1];
      updateScore();
    };
    gameConfig.ws.onclose = (event) => {
      console.log(event.code);
      if (event.code == 4101) {
        updateScore();
        document.getElementById("game-over").classList.remove("d-none");
        document.getElementById("winner-name").innerText = playerOne.score > playerTwo.score ? gameConfig.names[0] : gameConfig.names[1];
      }
      if (event.code == 4102) {
        console.log("Tournament match finished");
        let result = {
          [gameConfig.names[0]]: gameState.score[0],
          [gameConfig.names[1]]: gameState.score[1]
        };
        cup.ws.send(JSON.stringify({
          type: 'game' + cup.currentMatch,
          match: cup.matches[cup.currentMatch - 1],
          result: result
        }));
        cup.currentMatch++;
        cancelAnimationFrame(gameConfig.animationID);
        replaceHistoryAndGoTo("/Tournament");
      }
      game.field.classList.add("paused");
      cancelAnimationFrame(gameConfig.animationID);
      gameState.isFinished = true;
      if (event.code == 4441) {
        alert("Player disconnected");
        replaceHistoryAndGoTo("/Game");
      }
      if (event.code == 4442) {
        alert("Room expired");
        replaceHistoryAndGoTo("/Game");
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
    const speed = gameConfig.hasCPU ? gameParameters.playerSpeed * 2 : gameParameters.playerSpeed;
    if (keys[up1]) playerOne.y -= speed * delta;
    if (keys[down1]) playerOne.y += speed * delta;
    if (keys[up2]) playerTwo.y -= gameParameters.playerSpeed * delta;
    if (keys[down2]) playerTwo.y += gameParameters.playerSpeed * delta;
  }
}
