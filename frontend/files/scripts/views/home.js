import { Component } from "../library/component.js";
import { gameState, gameConfig } from "../game/game.js";
import { pushHistoryAndGoTo, replaceHistoryAndGoTo } from "../utils/router.js";
import { myUsername } from "../../index.js";
import { isLoggedIn } from "../../index.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100 d-flex flex-column align-items-center gap-3 game-menu-container">
	<h1 class="align-self-center" id="project-title">PONG</h1>
			<div class="d-flex flex-column gap-3 px-3 game-menu pb-5">
				<div class="fs-5 text-danger d-none text-center" id="sock-err-msg"></div>
				<button class="btn btn-primary rounded-0 fs-5" id="start-btn">Start</button>
				<a href="/Options" class="btn btn-primary rounded-0 fs-5" data-link>Options</a>
				<a href="/${myUsername.username}" class="btn btn-primary rounded-0 fs-5" data-link>Profile</a>
				<button class="btn btn-primary rounded-0 fs-5" id="logout-button">Exit</button>
			</div>
		</div>
	`;
    this.render();
    this.addEventListeners();
  }

  addEventListeners() {
    const startBtn = document.getElementById("start-btn");
    const sockErrMsg = document.getElementById("sock-err-msg");
    const logoutButton = document.getElementById("logout-button");
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

    logoutButton.addEventListener("click", async () => {
      await fetch(`http://${location.hostname}:8000/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          localStorage.removeItem("jwt");
          isLoggedIn.status = false;
          replaceHistoryAndGoTo("/Login");
        })
        .catch((error) => {
          console.log("we got an error: ", error);
        });
    });
  }
}
