import { Component } from "../library/component.js";
import { gameState, gameConfig } from "../game/game.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100 d-flex flex-column align-items-center gap-3 game-menu">
			<div class="d-flex flex-column gap-3 px-3">
				<a href="/Game" class="btn btn-primary rounded-0 fs-5" data-link>Start</a>
				<input type="text" class="form-control rounded-0 fs-5" placeholder="Room ID" />
				<button class="btn btn-primary rounded-0 fs-5" id="create-room-btn">Create</button>
				<button class="btn btn-primary rounded-0 fs-5" id="options-btn">options</button>
				<div class="game-options d-flex flex-column align-items-stretch gap-3 d-none">
					<div class="fs-5 d-flex align-items-center gap-3">
						<div class="w-50 d-flex justify-content-end">players</div>
						<div class="btn-group w-50" role="group" id="players-number-group"><button
								class="btn rounded-0 fs-5 settings-switch">1</button><button
								class="btn rounded-0 fs-5 settings-switch">2</button></div>
					</div>
					<div class="fs-5 d-flex align-items-center gap-3">
						<div class="w-50 d-flex justify-content-end">aim</div>
						<div class="btn-group w-50" role="group" id="aim-group"><button
								class="btn rounded-0 fs-5 settings-switch">on</button><button
								class="btn rounded-0 fs-5 settings-switch">off</button></div>
					</div>
					<div class="fs-5 d-flex align-items-center gap-3">
						<div class="w-50 d-flex justify-content-end">powerups</div>
						<div class="btn-group w-50" role="group" id="powerup-group"><button
								class="btn settings-switch rounded-0 fs-5">on</button><button
								class="btn settings-switch rounded-0 fs-5">off</button></div>
					</div>
					<div class="fs-5 d-flex align-items-center gap-3 justify-content-end">
						<div class=" d-flex justify-content-end">ai</div>
						<div class="btn-group w-100" role="group" id="cpu-group"><button
								class="btn settings-switch rounded-0 fs-5">easy</button><button
								class="btn settings-switch rounded-0 fs-5">normal</button>
							<button class="btn settings-switch rounded-0 fs-5">hard</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
    this.render();
    this.addEventListeners();
  }

  render() {
    super.render();
    this.playersNumber = document.querySelectorAll(
      "#players-number-group .settings-switch"
    );
    if (gameConfig.hasCPU) {
      this.playersNumber[0].classList.add("on");
      this.playersNumber[1].classList.remove("on");
    } else {
      this.playersNumber[0].classList.remove("on");
      this.playersNumber[1].classList.add("on");
    }
    this.aim = document.querySelectorAll("#aim-group .settings-switch");
    if (gameConfig.hasAim) {
      this.aim[0].classList.add("on");
      this.aim[1].classList.remove("on");
    } else {
      this.aim[0].classList.remove("on");
      this.aim[1].classList.add("on");
    }
    this.powerup = document.querySelectorAll("#powerup-group .settings-switch");
    if (gameConfig.hasPowerUps) {
      this.powerup[0].classList.add("on");
      this.powerup[1].classList.remove("on");
    } else {
      this.powerup[0].classList.remove("on");
      this.powerup[1].classList.add("on");
    }
    this.cpu = document.querySelectorAll("#cpu-group .settings-switch");
    for (let i = 0; i < this.cpu.length; i++) {
      if (gameConfig.CPULevel === i + 1) {
        this.cpu[i].classList.add("on");
      } else {
        this.cpu[i].classList.remove("on");
      }
    }
  }

  addEventListeners() {
    const optionsBtn = document.getElementById("options-btn");
    const options = document.querySelector(".game-options");
    optionsBtn.addEventListener("click", () => {
      options.classList.toggle("d-none");
    });
    this.playersNumber.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gameConfig.hasCPU = index === 0;
        console.log(gameConfig.hasCPU);
        btn.classList.add("on");
        this.playersNumber[1 - index].classList.remove("on");
      });
    });
    this.aim.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gameConfig.hasAim = index === 0;
        btn.classList.add("on");
        this.aim[1 - index].classList.remove("on");
      });
    });
    this.powerup.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gameConfig.hasPowerUps = index === 0;
        btn.classList.add("on");
        this.powerup[1 - index].classList.remove("on");
      });
    });
    this.cpu.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gameConfig.CPULevel = index + 1;
        btn.classList.add("on");
        for (let i = 0; i < this.cpu.length; i++) {
          if (i !== index) {
            this.cpu[i].classList.remove("on");
          }
        }
      });
    });
    const createRoomBtn = document.getElementById("create-room-btn");
    createRoomBtn.addEventListener("click", () => {
      fetch(`http://${location.hostname}:8001/create-game/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
        });
    });
  }
}
