export default class Paddle {
  constructor(paddleElem, aimElem) {
    this.paddleElem = paddleElem;
    this.aimElem = aimElem;
    this.onY = 50;
	this._angle = 0;
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
    return parseFloat(
      getComputedStyle(this.paddleElem).getPropertyValue("--y")
    );
  }

  set y(value) {
    this.paddleElem.style.setProperty("--y", value);
  }

  rect() {
    return this.paddleElem.getBoundingClientRect();
  }

  reset() {
    this.y = 50;
  }

  // i am not sure how this should work
  async fetchUpdate() {
    await fetch("/paddle")
      .then((response) => response.json())
      .then((data) => {
        this.y = data.y;
      });
  }

  async sendUpdate() {
    await fetch("/paddle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ y: this.y }),
    });
  }
}
