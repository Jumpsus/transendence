import { Component } from "../library/component.js";
import { gameConfig } from "../game/setup.js";

export class Game extends Component {
	constructor() {
		super(document.body);
		this.view = `
		<div class="w-100 h-100 position-relative" id="game-container">
			<div class="position-absolute d-flex flex-column align-items-center justify-content-center w-100 h-100 d-none" id="pause-menu">
				<div>resume?</div>
				<div class="d-flex">
					<div id="resume-btn">Yes</div><a href="/Select" id="quit-button" data-link>No</a>
				</div>
			</div>
			<div class="position-absolute d-flex flex-column align-items-center justify-content-center w-100 h-100 d-none" id="game-over">
					<div>winner is:</div>
					<div id="winner-name"></div>
					<a href="/Select" id="quit-button" data-link>quit</a>
				</div>
			<div class="d-flex flex-column flex-xl-row justify-content-center position-relative"
				id="game-field">
				<div class="position-absolute d-none" id="instructions-left"><div>You are here</div><div class="not-touch-instr">use w/d to move paddle</div></div>
				<div class="position-absolute d-none" id="instructions-right"><div>You are here</div><div class="not-touch-instr">use up/down to move paddle</div></div>
				<div class="paddle position-absolute" id="player-one">
				</div>
				<div class="position-absolute" id="pause-area">
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
			window.cancelAnimationFrame(gameConfig.animationID);
		});
	}
}
