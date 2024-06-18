import { Component } from "../library/component.js";
import { gameConfig } from "../game/game.js";
import { Home } from "./home.js";
import { host } from "../../index.js"

export class modeSelect extends Component {
  constructor() {
    const gameMenu = document.querySelector(".game-menu");
    if (!gameMenu) {
      new Home();
    }
    super(document.querySelector(".game-menu"));
    this.view = `
	<div>mode select</div>
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
