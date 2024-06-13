import { Component } from "../library/component.js";
import { gameState } from "../game/game.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100 d-flex flex-column justify-content-center align-items-center gap-3">
		<div>
			<a href="/Game" class="btn btn-primary rounded-0" data-link>1 vs 1</a>
			<a href="/Game" class="btn btn-primary rounded-0" data-link>1 vs CPU</a>
		</div>
		<div class="d-flex flex-column gap-3">
			<button class="btn btn-primary rounded-0" id="create-room-btn">Create a room</button>
			<input type="text" class="form-control rounded-0" placeholder="Room ID" />
			<a class="btn btn-primary rounded-0" id="join-room-btn">Join a room</a>
		</div>
	</div>
	`;
    this.render();
    this.addEventListeners();
  }
  addEventListeners() {
    const createRoomBtn = document.getElementById("create-room-btn");
    const joinRoomBtn = document.getElementById("join-room-btn");
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
    document.body.addEventListener("click", (event) => {
      const targetElement = event.target.closest("[data-link]");

      if (targetElement) {
        event.preventDefault();
        gameState.hasCPU = targetElement.textContent.includes("CPU");
      }
    });
  }
}
