import { Component } from "../library/component.js";
import { gameConfig } from "../game/setup.js";
import { Home } from "./home.js";
import { host } from "../../index.js";

export class ModeSelect extends Component {
  constructor() {
    const gameMenu = document.querySelector(".game-menu");
    if (!gameMenu) {
      new Home();
    }
    super(document.querySelector(".game-menu"));
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
						<a class="retro-btn online w-50 text-center py-3 position-relative">
						Cup
						<div class="online-light position-absolute"></div>
						</a>
					</div>
				</div>
				<div class="d-flex align-items-center justify-content-end gap-3" style="cursor: pointer" id="aim-select">
					<div class="">Aim</div>
					<div class="check-box d-flex justify-content-center align-items-center"></div>
				</div>
			</div>
	`;
    this.render();
    this.addEventListeners();
  }

  render() {
    super.render();
    const aim = document.querySelector(".check-box");
    if (gameConfig.hasAim) aim.innerText = "x";
    else aim.innerText = "";
  }

  addEventListeners() {
    const aim = document.querySelector(".check-box");
	const aimSelect = document.getElementById("aim-select");
    aimSelect.addEventListener("click", () => {
      gameConfig.hasAim = !gameConfig.hasAim;
      if (gameConfig.hasAim) aim.innerText = "x";
      else aim.innerText = "";
    });
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
