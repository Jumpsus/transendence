import { gameConfig } from "./game.js";

export default class Collectible {
  constructor(collectibleElem) {
    this.collectibleElem = collectibleElem;
    this.types = ["speedy", "paddleReducer", "paddleEnlarger"];
    this.type = this.getRandomType();
    this.element = this.createElement();
    this.setPosition();
    this.render();
  }

  getRandomType() {
    const randomIndex = Math.floor(Math.random() * this.types.length);
    return this.types[randomIndex];
  }

  createElement() {
    const div = document.createElement("div");
    div.classList.add("collectible", this.type);
    return div;
  }

  setPosition() {
    const voidZone = gameConfig.bufferWidth + gameConfig.paddleWidth + 10;
    const x = Math.random() * (100 - voidZone) + voidZone;
    const y = Math.random() * (100 - voidZone) + voidZone;
    this.element.style.setProperty("--x", x);
    this.element.style.setProperty("--y", y);
  }

  render() {
    document.getElementById("game-field").appendChild(this.element);
  }

  delete() {
	setTimeout(() => {
	  this.element.remove();
	}, gameConfig.collectibleTimeout);
  }

  rect() {
    return this.element.getBoundingClientRect();
  }
}
