import { Component } from "../library/component.js";

export class Game extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100" id="game-container">
			<div class="d-flex flex-column flex-xl-row justify-content-center position-relative"
				id="game-field">
				<div class="paddle position-absolute" id="player-one"></div>
				<div class="position-absolute" id="pause-area"></div>
				<div class="position-relative" id="separator">
					<div class="d-flex flex-xl-column justify-content-around flex-row w-100 h-100">
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
						<div class=" separator-chunk"></div>
					</div>
					<div class="fs-1 position-absolute" id="score-one">00</div>
					<div class="fs-1 position-absolute" id="score-two">00</div>
					<div class="fs-4 position-absolute" id="name-one"></div>
					<div class="fs-4 position-absolute" id="name-two"></div>
				</div>
				<div class=" position-absolute" id="ball"></div>
				<div class=" paddle position-absolute" id="player-two"></div>
			</div>
		</div>
	`;
    this.render();
  }
  render() {
    super.render();
    import("../game/game.js")
      .then((module) => {
        console.log("Game script loaded");
        module.init();
      })
      .catch((error) => {
        console.error("Error loading Pong game script:", error);
      });
  }
}
