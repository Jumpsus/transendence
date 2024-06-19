import { Component } from "../library/component.js";
import { gameConfig } from "../game/setup.js";
import { Home } from "./home.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";
import { host } from "../../index.js";

export class Options extends Component {
  constructor() {
    const gameMenu = document.querySelector(".game-menu");
    if (!gameMenu) {
      new Home();
    }
    super(document.querySelector(".game-menu"));
    this.view = `
	<a href="/" id="back-button" class="" data-link>
		< Back</a>
	<div class="game-options d-flex flex-column align-items-stretch gap-3 mt-4">
		<div class="d-flex justify-content-between" id="modeSwitch">
			<div class="">theme</div>
			<div id="theme-name"></div>
		</div>
	</div>
	`;
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    setupDarkModeToggle(document.getElementById("theme-name"));
  }
}
