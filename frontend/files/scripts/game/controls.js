import { game, keys } from "./setup.js";

export function setupControls(playerOne, playerTwo) {
  window.addEventListener("keydown", (event) => {
    keys[event.key] = true;
  });

  window.addEventListener("keyup", (event) => {
    keys[event.key] = false;
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
    const gameRect = game.container.getBoundingClientRect();
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
  game.field.addEventListener("touchstart", handleTouchStart, options);
  game.field.addEventListener("touchmove", handleTouchMove, options);
  game.field.addEventListener("touchend", handleTouchEnd, options);
  game.field.addEventListener("touchcancel", handleTouchEnd, options);
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
