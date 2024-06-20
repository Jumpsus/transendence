import { gameConfig } from "./setup.js";
import { gameParameters } from "./setup.js";

export default class Paddle {
  constructor(paddleElem, id) {
    this.paddleElem = paddleElem;
	this.id = id;
	this._y = 50;
  }

  get y() {
	if (gameConfig.isOnline)
		return this._y;
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--y")
    );
  }

  set y(value) {
	const paddleHalf = gameParameters.paddleHeight / 2;
    value = Math.max(paddleHalf, Math.min(value, 100 - paddleHalf));
	if (gameConfig.isOnline)
		this._y = value;
    this.paddleElem.style.setProperty("--y", value);
  }

  get x() {
	return parseFloat(getComputedStyle(this.paddleElem).getPropertyValue("--x"));
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    this.y = 50;
  }
}
