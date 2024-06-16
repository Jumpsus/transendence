import { Component } from "../library/component.js";
import { gameState, gameConfig } from "../game/game.js";
import { pushHistoryAndGoTo, replaceHistoryAndGoTo } from "../utils/router.js";
import { myUsername, isLoggedIn, host } from "../../index.js";

export class Home extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="d-flex flex-column">
		<h1 id="project-title">PONG</h1>
		<div class="d-flex flex-column px-3 game-menu pb-5 align-self-center">
			<div class="fs-5 text-danger d-none text-center" id="sock-err-msg"></div>
			<div class="menu-btn" id="start-btn">
				<div class="mini-paddle p1"></div>
				Start
				<div class="mini-paddle p2"></div>
			</div>
			<a href="/Options" class="menu-btn" data-link>
				<div class="mini-paddle p2"></div>
				Options
				<div class="mini-paddle p1"></div>
			</a>
			<a href="/${myUsername.username}" class="menu-btn" data-link>
				<div class="mini-paddle p1"></div>
				Profile
				<div class="mini-paddle p2"></div>
			</a>
			<div class="menu-btn" id="logout-button">
				<div class="mini-paddle p2"></div>
				Exit
				<div class="mini-paddle p1"></div>
			</div>
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
        gameConfig.ws = new WebSocket(
          `wss://${host}/ws/game/${gameConfig.roomId}/`
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
      await fetch(`https://${host}/user-management/user/logout`, {
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
