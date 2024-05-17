export default class Paddle {
  constructor(paddleElem) {
    this.paddleElem = paddleElem;
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
