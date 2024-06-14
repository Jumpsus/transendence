import { Component } from "../library/component.js";
import { gameState, gameConfig } from "../game/game.js";
import { pushHistoryAndGoTo } from "../utils/router.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100 d-flex flex-column align-items-center gap-3 game-menu-container">
			<div class="d-flex flex-column gap-3 px-3 game-menu pb-5">
				<button class="btn btn-primary rounded-0 fs-5" id="start-btn">Start</button>
				<button class="btn btn-primary rounded-0 fs-5" id="options-btn">options</button>
				<div class="game-options d-flex flex-column align-items-stretch gap-3 d-none">
					<div class="fs-5 d-flex align-items-center gap-3">
						<div class="w-50 d-flex justify-content-end">players</div>
						<div class="btn-group w-50" role="group" id="players-number-group"><button
								class="btn rounded-0 fs-5 settings-switch">1</button><button
								class="btn rounded-0 fs-5 settings-switch">2</button></div>
					</div>
					<div class="fs-5 d-flex align-items-center gap-3 justify-content-end" id="cpu-options">
						<div class=" d-flex justify-content-end">ai</div>
						<div class="btn-group w-100" role="group" id="cpu-group"><button
								class="btn settings-switch rounded-0 fs-5">easy</button><button
								class="btn settings-switch rounded-0 fs-5">normal</button>
							<button class="btn settings-switch rounded-0 fs-5">hard</button>
						</div>
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
					<div class="fs-5 d-flex align-items-center gap-3">
						<div class="w-50 d-flex justify-content-end">online</div>
						<div class="btn-group w-50" role="group" id="online-group"><button
								class="btn rounded-0 fs-5 settings-switch">yes</button><button
								class="btn rounded-0 fs-5 settings-switch">no</button></div>
					</div>
					<div class="d-flex flex-column gap-3 d-none" id="id-group">
					<input type="text" class="form-control rounded-0 fs-5" placeholder="Room ID" id="room-ID"/>
					<button class="btn btn-primary rounded-0 fs-5" id="create-room-btn">Create</button>
					<div class="fs-5 text-danger d-none text-center" id="sock-err-msg"></div>
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
    this.idGroup = document.getElementById("id-group");
    this.online = document.querySelectorAll("#online-group .settings-switch");
    this.cpuOptions = document.getElementById("cpu-options");
    if (gameConfig.isOnline) {
      this.online[0].classList.add("on");
      this.online[1].classList.remove("on");
      this.idGroup.classList.remove("d-none");
      document.getElementById("start-btn").innerText = "join";
    } else {
      this.online[0].classList.remove("on");
      this.online[1].classList.add("on");
      this.idGroup.classList.add("d-none");
      document.getElementById("start-btn").innerText = "start";
    }
    this.playersNumber = document.querySelectorAll(
      "#players-number-group .settings-switch"
    );
    if (gameConfig.hasCPU) {
      this.playersNumber[0].classList.add("on");
      this.playersNumber[1].classList.remove("on");
      this.cpuOptions.classList.remove("d-none");
    } else {
      this.playersNumber[0].classList.remove("on");
      this.playersNumber[1].classList.add("on");
      this.cpuOptions.classList.add("d-none");
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
    const startBtn = document.getElementById("start-btn");
    const sockErrMsg = document.getElementById("sock-err-msg");
    startBtn.addEventListener("click", () => {
      if (gameConfig.isOnline) {
        gameConfig.roomId = document.getElementById("room-ID").value;
        gameConfig.ws = new WebSocket(
          `ws://${location.hostname}:8001/${gameConfig.roomId}/`
        );
        gameConfig.ws.onopen = () => {
          console.log("connected");
          pushHistoryAndGoTo("/Game");
          sockErrMsg.classList.add("d-none");
          sockErrMsg.innerText = "";
        };
        gameConfig.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          sockErrMsg.classList.remove("d-none");
          sockErrMsg.innerText = "Room not found";
        };
      } else {
        pushHistoryAndGoTo("/Game");
      }
    });

    const optionsBtn = document.getElementById("options-btn");
    const options = document.querySelector(".game-options");
    optionsBtn.addEventListener("click", () => {
      options.classList.toggle("d-none");
    });
    this.online.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gameConfig.isOnline = index === 0;
        btn.classList.add("on");
        this.online[1 - index].classList.remove("on");
        if (gameConfig.isOnline) {
          startBtn.innerText = "join";
          this.idGroup.classList.remove("d-none");
          gameConfig.hasCPU = false;
          this.playersNumber[1].classList.add("on");
          this.playersNumber[0].classList.remove("on");
          this.cpuOptions.classList.add("d-none");
        } else {
          startBtn.innerText = "start";
          this.idGroup.classList.add("d-none");
        }
      });
    });
    this.playersNumber.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gameConfig.hasCPU = index === 0;
        btn.classList.add("on");
        if (gameConfig.hasCPU) {
          this.cpuOptions.classList.remove("d-none");
          gameConfig.isOnline = false;
          this.online[1].classList.add("on");
          this.online[0].classList.remove("on");
          this.idGroup.classList.add("d-none");
        } else {
          this.cpuOptions.classList.add("d-none");
        }
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
    const inputID = document.getElementById("room-ID");
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
          inputID.value = data.game_id;
        });
    });
  }
}
