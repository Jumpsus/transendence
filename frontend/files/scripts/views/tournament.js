import { Component } from "../library/component.js";
import { Home } from "./home.js";
import { myUsername } from "../../index.js";
import { host } from "../../index.js";
import { pushHistoryAndGoTo } from "../utils/router.js";
import { gameConfig } from "../game/setup.js";

export const cup = { ws: null };

export class Tournament extends Component {
	constructor() {
		const gameMenu = document.getElementById("game-menu");
		if (!gameMenu) {
			new Home();
		}
		super(document.getElementById("game-menu"));
		this.view = `
			<a href="/Select" id="back-button" class="pb-4" data-link>
			< Back</a>
			 <button class="retro-btn mb-4" id="join-cup-btn">join</button>
			 <div class="d-flex justify-content-center text-center" id="cup-log"><span id="player-number">0</span>/<span>4</span> connected</div>
	`;
		this.render();
		this.addEventListeners();
	}
	async addEventListeners() {
		const resp = await fetch(`https://${host}/user-management/user/getinfo`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("jwt")}`,
			},
		});
		const data = await resp.json();
		const tagField = data.tag;
		const joinCupBtn = document.getElementById("join-cup-btn");
		const playerN = document.getElementById("player-number");
		const cupLog = document.getElementById("cup-log");
		joinCupBtn.addEventListener("click", async () => {
			const name = tagField ? tagField : myUsername.username;
			cup.ws = new WebSocket(
				`wss://${host}/ws/game/${name}/`
			);
			cup.ws.onopen = () => {
				console.log("connected");
			};
			cup.ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.hasOwnProperty("waiting"))
					playerN.innerText = data.waiting;
				else if (data.hasOwnProperty("game-start")) {
					cupLog.innerText = "4/4 connected";
				}
				else if (data.hasOwnProperty("matches")) {
					const matches = data.matches;
					console.log(matches);
					setTimeout(() => {
						console.log("Game starting");
						// gameConfig.ws = new WebSocket(
						// 	`wss://${host}/ws/game/${gameConfig.roomId}/`
						// );
						// gameConfig.ws.onopen = () => {
						// 	console.log("connected");
						// 	gameConfig.isOnline = true;
						// 	gameConfig.key = true;
						// 	pushHistoryAndGoTo("/Game");
						// 	sockErrMsg.classList.add("d-none");
						// 	sockErrMsg.innerText = "";
						// };
						// gameConfig.ws.onerror = (error) => {
						// 	console.error("WebSocket error:", error);
						// 	sockErrMsg.classList.remove("d-none");
						// 	sockErrMsg.innerText = "Room not found";
						// };
						// pushHistoryAndGoTo("/Game");
					}, 5000);
				}
				// console.log(data);
			};
			cup.ws.onerror = (error) => {
				console.error("WebSocket error:", error);
			};
		});
	}
}
