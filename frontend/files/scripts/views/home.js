import { Component } from "../library/component.js";
import { gameState } from "../game/game.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100 d-flex justify-content-center align-items-center gap-3">
		<a href="/Game" class="btn btn-primary" data-link>1 vs 1</a>
		<a href="/Game" class="btn btn-primary" data-link>1 vs CPU</a>
	</div>
	`;
    this.render();
	this.addEventListeners();
  }
  addEventListeners() {
	document.body.addEventListener("click", (event) => {
	  const targetElement = event.target.closest("[data-link]");

	  if (targetElement) {
		event.preventDefault();
		gameState.hasCPU = targetElement.textContent.includes("CPU");
	  }
	});
  }
}
