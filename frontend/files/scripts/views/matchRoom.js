import { Component } from "../library/component.js";
import { gameConfig } from "../game/setup.js";
import { Home } from "./home.js";
import { pushHistoryAndGoTo, replaceHistoryAndGoTo } from "../utils/router.js";
import { host } from "../../index.js";
import { setMyUsername, isLoggedIn } from "../../index.js";

export class MatchRoom extends Component {
  constructor() {
    const gameMenu = document.getElementById("game-menu");
    if (!gameMenu) {
      new Home();
    }
    super(document.getElementById("game-menu"));
    this.view = `
    <a href="/Select" id="back-button" class="pb-4" data-link>
      < Back</a>
    <div class="d-flex flex-column align-items-stretch justify-content-center gap-3">
      <div class="retro-btn" id="join-btn">Join room</div>
      <input type="text" class="form-control rounded-0" placeholder="Room ID" id="room-ID" />
      <button class="retro-btn" id="create-room-btn">Create</button>
      <div class="fs-5 text-danger d-none text-center" id="sock-err-msg"></div>
    </div>
	`;
    this.render();
    this.addEventListeners();
  }

   addEventListeners() {
    const joinBtn = document.getElementById("join-btn");
    const sockErrMsg = document.getElementById("sock-err-msg");
    joinBtn.addEventListener("click", async () => {
		const is_valid = await setMyUsername()
		if (!is_valid) {
			localStorage.removeItem("jwt");
			isLoggedIn.status = false;
			replaceHistoryAndGoTo("/");
			return;
		}
      gameConfig.ws = new WebSocket(
        `wss://${host}/ws/game/${gameConfig.roomId}/${localStorage.getItem("jwt")}/0/`
      );
      gameConfig.ws.onopen = () => {
        gameConfig.isOnline = true;
        gameConfig.key = true;
        pushHistoryAndGoTo("/Game");
        sockErrMsg.classList.add("d-none");
        sockErrMsg.innerText = "";
      };
      gameConfig.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        sockErrMsg.classList.remove("d-none");
        sockErrMsg.innerText = "Room not found";
      };
    });
    const createRoomBtn = document.getElementById("create-room-btn");
    const inputID = document.getElementById("room-ID");
    inputID.addEventListener("change", () => {
      gameConfig.roomId = inputID.value;
    });
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
