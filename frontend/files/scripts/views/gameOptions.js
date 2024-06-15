import { Component } from "../library/component.js";
import { gameConfig } from "../game/game.js";
import { Home } from "./home.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";
import { host } from "../../index.js"

export class GameOptions extends Component {
  constructor() {
    console.log("GameOptions");
    const gameMenu = document.querySelector(".game-menu");
    if (!gameMenu) {
      new Home();
    }
    super(document.querySelector(".game-menu"));
    this.view = `
	<a href="/" id="back-button" class="btn rounded-0 align-self-start fs-5" data-link >< Back</a>
	<div class="game-options d-flex flex-column align-items-stretch gap-3">
						<div class="fs-3 m-0 mt-sm-auto d-flex align-items-center justify-content-end  menu-item position-relative" id="modeSwitch">
						<svg height="40" width="40" xmlns="http://www.w3.org/2000/svg" id="sunIcon"  viewBox="0 0 24 24" id="Weather-Cloud-Sun-Fine--Streamline-Pixel" fill="currentColor" style="display:none"><desc>Weather Cloud Sun Fine Streamline Icon: https://streamlinehq.com</desc><title>weather-cloud-sun-fine</title><g><path d="M22.8525 14.29125H24v4.5675h-1.1475Z"  stroke-width="1"></path><path d="M21.7125 8.57625H24v1.1400000000000001h-2.2874999999999996Z"  stroke-width="1"></path><path d="M21.7125 18.85875h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.7125 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.7125 2.86125h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 20.00625h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M2.2874999999999996 21.146250000000002h18.285v1.1400000000000001H2.2874999999999996Z"  stroke-width="1"></path><path d="M15.997499999999999 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M15.997499999999999 1.71375h1.1400000000000001v2.2874999999999996h-1.1400000000000001Z"  stroke-width="1"></path><path d="M14.857499999999998 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M11.43 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M10.2825 2.86125h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="m10.2825 7.428749999999999 3.4275 0 0 1.1475 2.2874999999999996 0 0 1.1400000000000001 1.1400000000000001 0 0 2.2874999999999996 3.435 0 0 -4.574999999999999 -1.1475 0 0 -1.1400000000000001 -1.1400000000000001 0 0 -1.1400000000000001 -3.4275 0 0 1.1400000000000001 -5.715 0 0 1.1400000000000001 -1.1475 0 0 1.1475 2.2874999999999996 0 0 -1.1475z"  stroke-width="1"></path><path d="M7.995 14.29125h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="M6.855 13.143749999999999h1.1400000000000001v1.1475H6.855Z"  stroke-width="1"></path><path d="M6.855 8.57625h1.1400000000000001v1.1400000000000001H6.855Z"  stroke-width="1"></path><path d="m6.855 13.143749999999999 0 -3.4275 -1.1400000000000001 0 0 2.2874999999999996 -3.4275 0 0 1.1400000000000001 4.5675 0z"  stroke-width="1"></path><path d="M1.1400000000000001 20.00625h1.1475v1.1400000000000001H1.1400000000000001Z"  stroke-width="1"></path><path d="M1.1400000000000001 13.143749999999999h1.1475v1.1475H1.1400000000000001Z"  stroke-width="1"></path><path d="M0 14.29125h1.1400000000000001v5.715H0Z"  stroke-width="1"></path></g></svg>
					<svg width="40" height="40" viewBox="0 0 28 30" fill="currentColor" id="moonIcon"
						transform="translate(0, 10)" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M8 2H16V4H14V6H12V4H8V2ZM6 6V4H8V6H6ZM6 16H4V6H6V16ZM8 18H6V16H8V18ZM10 20H8V18H10V20ZM20 20V22H10V20H20ZM22 18V20H20V18H22ZM20 14H22V18H24V10H22V12H20V14ZM14 14V16H20V14H14ZM12 12H14V14H12V12ZM12 12V6H10V12H12Z" />
					</svg>
						<div class="ms-3 fs-5 d-lg-block d-none" id="theme-name"></div>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" class="ms-auto menu-selector" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M10 20H8V4H10V6H12V9H14V11H16V13H14V15H12V18H10V20Z"/>
						</svg>
					</div>
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
    } else {
      this.online[0].classList.remove("on");
      this.online[1].classList.add("on");
      this.idGroup.classList.add("d-none");
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
    const themeName = document.getElementById("theme-name");
    setupDarkModeToggle(themeName);
    const options = document.querySelector(".game-options");
    this.online.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        gameConfig.isOnline = index === 0;
        btn.classList.add("on");
        this.online[1 - index].classList.remove("on");
        if (gameConfig.isOnline) {
          this.idGroup.classList.remove("d-none");
          gameConfig.hasCPU = false;
          this.playersNumber[1].classList.add("on");
          this.playersNumber[0].classList.remove("on");
          this.cpuOptions.classList.add("d-none");
        } else {
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
    inputID.addEventListener("change", () => {
      console.log(inputID.value);
      gameConfig.roomId = inputID.value;
    })
    createRoomBtn.addEventListener("click", () => {
      fetch(`https://${host}/game/create-game/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          inputID.value = data.game_id;
          gameConfig.roomId = data.game_id;
        });
    });
  }
}
