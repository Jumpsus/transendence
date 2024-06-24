import { Component } from "../library/component.js";
import { gameConfig } from "../game/setup.js";
import { Home } from "./home.js";
import { myUsername } from "../../index.js";

export class ModeSelect extends Component {
	constructor() {
		const gameMenu = document.getElementById("game-menu");
		if (!gameMenu) {
			new Home();
		}
		super(document.getElementById("game-menu"));
		this.view = `
			<a href="/" id="back-button" class="pb-4" data-link>
			< Back</a>
			<div class="d-flex flex-column gap-3">
				<div class="d-flex flex-column p-3 pt-1 gap-2 mode-box">
					<div class="fs-5 text-center">Classic mode</div>
					<div class="d-flex gap-3 justify-content-evenly">
						<a href="/Game" class="retro-btn w-50 text-center py-3" id="vs1" data-link>1 vs 1</a>
						<a href="/Game" class="retro-btn w-50 text-center py-3" id="vsCPU" data-link>1 vs CPU</a>
					</div>
				</div>
				<div class="d-flex flex-column p-3 pt-1 gap-2 mode-box">
					<div class="fs-5 text-center">Network play</div>
					<div class="d-flex gap-3 justify-content-evenly">
						<a href="/MatchRoom" class="retro-btn online w-50 text-center py-3 position-relative" data-link>
						Match
						<div class="online-light position-absolute"></div>
						</a>
						<a href="/Tournament" class="retro-btn online w-50 text-center py-3 position-relative" data-link>
						Cup
						<div class="online-light position-absolute"></div>
						</a>
					</div>
				</div>
			</div>
	`;
		this.render();
		this.addEventListeners();
	}

	async addEventListeners() {
		const vs1 = document.getElementById("vs1");
		vs1.addEventListener("click", () => {
			gameConfig.isOnline = false;
			gameConfig.hasCPU = false;
			gameConfig.key = true;
		});
		const vsCPU = document.getElementById("vsCPU");
		vsCPU.addEventListener("click", () => {
			gameConfig.isOnline = false;
			gameConfig.hasCPU = true;
			gameConfig.key = true;
		});
	}
}
