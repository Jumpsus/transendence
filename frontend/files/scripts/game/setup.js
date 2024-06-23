export let eventListenersSet = false;

export const gameState = {
  isHorizontal: true,
  isPaused: false,
  isFinished: false,
  score: [0, 0],
};

export const online = {
  myID: null,
  theirID: null,
};

export const gameConfig = {
  key: false,
  isOnline: false,
  isTouch: false,
  roomId: null,
  ws: null,
  hasCPU: false,
  animationID: null,
  names: [],
};

export const gameParameters = {
  paddleWidth: 2,
  paddleHeight: 20,
  ballWidth: 3,
  bufferWidth: 2,
  ballSpeed: 0.1,
  playerSpeed: 0.15,
  cpuUpdateTime: 1000,
};

export const game = {
  container: null,
  field: null,
  ball: null,
  paddleOne: null,
  paddleTwo: null,
};

export const keys = {};

function setDimensions() {
  const root = document.documentElement;
  root.style.setProperty("--paddleWidth", `${gameParameters.paddleWidth}`);
  root.style.setProperty("--paddleHeight", `${gameParameters.paddleHeight}`);
  root.style.setProperty("--ballWidth", `${gameParameters.ballWidth}`);
  root.style.setProperty("--bufferWidth", `${gameParameters.bufferWidth}`);
}

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

export function updateScore() {
  const scoreOne = document.getElementById("score-one");
  const scoreTwo = document.getElementById("score-two");
  scoreOne.innerText = gameState.score[0].toString().padStart(2, "0");
  scoreTwo.innerText = gameState.score[1].toString().padStart(2, "0");
}

function insertNames() {
  const nameOne = document.getElementById("name-one");
  const nameTwo = document.getElementById("name-two");
  if (gameConfig.hasCPU) {
    gameConfig.names = ["CPU", "PL1"];
  } else if (!gameConfig.isOnline) {
    gameConfig.names = ["PL1", "PL2"];
  } else if (gameConfig.isOnline) {
    gameConfig.names = ["", ""];
  }
  nameOne.innerText = gameConfig.names[0];
  nameTwo.innerText = gameConfig.names[1];
}

function pauseGame() {
  if (gameState.isFinished) return;
  gameState.isPaused = !gameState.isPaused;
  const pauseText = document.getElementById("pause-menu");
  if (gameState.isPaused) {
    pauseText.classList.remove("d-none");
    game.field.classList.add("paused");
  } else {
    pauseText.classList.add("d-none");
    game.field.classList.remove("paused");
  }
}

function setupElements() {
  game.container = document.getElementById("game-container");
  game.field = document.getElementById("game-field");
  game.ball = document.getElementById("ball");
  game.paddleOne = document.getElementById("player-one");
  game.paddleTwo = document.getElementById("player-two");
}

function setupState() {
  gameState.isHorizontal = game.field.clientWidth > game.field.clientHeight;
  gameState.isPaused = false;
  gameState.score = [0, 0];
  gameState.isFinished = false;
  for (let prop in keys) {
    if (keys.hasOwnProperty(prop)) {
      delete keys[prop];
    }
  }
}

function setupPause() {
  const resumeBtn = document.getElementById("resume-btn");
  const pauseArea = document.getElementById("pause-area");
  pauseArea.addEventListener("click", () => {
    pauseGame();
  });
  resumeBtn.addEventListener("click", () => {
    pauseGame();
  });
}

function setFieldBorders() {
  let borderWidth;
  if (
    gameState.isHorizontal &&
    game.container.offsetHeight != game.field.offsetHeight
  ) {
    borderWidth = game.container.offsetHeight / 80;
    game.field.style.setProperty(
      "border-top",
      `${borderWidth}px solid var(--game-ui-color)`
    );
    game.field.style.setProperty(
      "border-bottom",
      `${borderWidth}px solid var(--game-ui-color)`
    );
    game.field.style.setProperty("border-left", "none");
    game.field.style.setProperty("border-right", "none");
  } else if (
    !gameState.isHorizontal &&
    game.container.offsetWidth != game.field.offsetWidth
  ) {
    borderWidth = game.container.offsetWidth / 50;
    game.field.style.setProperty(
      "border-left",
      `${borderWidth}px solid var(--game-ui-color)`
    );
    game.field.style.setProperty(
      "border-right",
      `${borderWidth}px solid var(--game-ui-color)`
    );
    game.field.style.setProperty("border-top", "none");
    game.field.style.setProperty("border-bottom", "none");
  } else {
    game.field.style.setProperty("border", "none");
  }
}

function setEventListeners() {
  if (!eventListenersSet) {
	function debounce(func, wait) {
		let timeout;
		return function() {
			const context = this, args = arguments;
			clearTimeout(timeout);
			timeout = setTimeout(() => func.apply(context, args), wait);
		};
	}
	
	window.addEventListener('resize', debounce(() => {
		if (!game.field) return;
		gameState.isHorizontal = game.field.clientWidth > game.field.clientHeight;
		setFieldBorders();
	}, 200));
    document.addEventListener("keydown", (event) => {
      if (event.key === " " && !gameConfig.isOnline) {
        pauseGame();
      }
    });
    window.addEventListener("keydown", (event) => {
      if (gameConfig.hasCPU)
        if (["w", "s", "a", "d"].includes(event.key)) return;
      keys[event.key] = true;
    });

    window.addEventListener("keyup", (event) => {
      keys[event.key] = false;
    });
    eventListenersSet = true;
  } else return;
}

export function setupGame() {
  online.myID = 0;
  online.theirID = 0;
  gameConfig.key = false;
  gameConfig.isTouch = isTouchDevice();
  setEventListeners();
  setupElements();
  setupState();
  setDimensions();
  setFieldBorders();
  insertNames();
  updateScore();
  if (!gameConfig.isOnline)
    setupPause();
}
