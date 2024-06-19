import { gameConfig } from "./setup.js";
import { gameParameters } from "./setup.js";

export default class Paddle {
  constructor(paddleElem, aimElem, id) {
    this.paddleElem = paddleElem;
    this.aimElem = aimElem;
	this._angle = 0;
	this.id = id;
	this._y = 50;
  }

  get angle() {
	return this._angle;
  }

  set angle(value) {
	this._angle = Math.max(-80, Math.min(value, 80));
  }

  get aimX() {
    return parseFloat(getComputedStyle(this.aimElem).getPropertyValue("--x"));
  }

  set aimX(value) {
    this.aimElem.style.setProperty("--x", value);
  }

  get aimY() {
    return parseFloat(getComputedStyle(this.aimElem).getPropertyValue("--y"));
  }

  set aimY(value) {
    this.aimElem.style.setProperty("--y", value);
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
