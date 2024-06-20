import { Component } from "../library/component.js";
import { gameConfig } from "../game/setup.js";

export class Game extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="w-100 h-100 position-relative" id="game-container">
			<div class="d-flex flex-column flex-xl-row justify-content-center position-relative"
				id="game-field">
				<div class="position-absolute d-flex flex-column align-items-stretch d-none" id="pause-menu">
					<div>pause</div>
					<div id="resume-btn">resume</div>
					<a href="/Select" id="quit-button" data-link>quit</a>
				</div>
				<div class="position-absolute d-flex flex-column align-items-stretch d-none" id="game-over">
					<div>gameover</div>
					<div>winner is:</div>
					<div id="winner-name"></div>
					<a href="/Select" id="quit-button" data-link>quit</a>
				</div>
				<div class="paddle position-absolute" id="player-one">
				</div>
				<div class="position-absolute" id="pause-area">
				</div>
				<div class="aim position-absolute" id="aim-two">
						<div class="aim-part"></div>
						<div class="aim-part"></div>
						<div class="aim-part"></div>
						<div class="aim-part"></div>
					</div>
					<div class="aim position-absolute" id="aim-one">
						<div class="aim-part"></div>
						<div class="aim-part"></div>
						<div class="aim-part"></div>
						<div class="aim-part"></div>
				</div>
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
					<div class="position-absolute score" id="score-one"></div>
					<div class="position-absolute score" id="score-two"></div>
					<div class="position-absolute player-name" id="name-one"></div>
					<div class="position-absolute player-name" id="name-two"></div>
				</div>
				<div class=" position-absolute" id="ball"></div>
				<div class=" paddle position-absolute" id="player-two">
				</div>
			</div>
		</div>
	`;
    this.render();
    this.setupEventListeners();
  }
  render() {
    super.render();
    import("../game/game.js")
      .then((module) => {
        module.init();
      })
      .catch((error) => {
        console.error("Error loading Pong game script:", error);
      });
  }

  setupEventListeners() {
    const quitBtn = document.getElementById("quit-button");
    quitBtn.addEventListener("click", () => {
      console.log(gameConfig.animationID);
      window.cancelAnimationFrame(gameConfig.animationID);
    });
  }
}
