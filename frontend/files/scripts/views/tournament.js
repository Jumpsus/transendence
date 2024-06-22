import { Component } from "../library/component.js";
import { Home } from "./home.js";
import { myUsername } from "../../index.js";
import { host } from "../../index.js";
import { pushHistoryAndGoTo } from "../utils/router.js";
import { gameConfig, gameState } from "../game/setup.js";

export const cup = { ws: null, matches: [], currentMatch: 1 };

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
     		 <div class="fs-5 text-danger d-none text-center" id="sock-err-msg"></div>
			 <div class="d-flex justify-content-center text-center" id="cup-results"></div>
	`;
		this.render();
		this.addEventListeners();
	}
	render() {
		super.render();
		const joinCupBtn = document.getElementById("join-cup-btn");
		const cupLog = document.getElementById("cup-log");
		if (cup.ws) {
			joinCupBtn.classList.add("d-none");
			cupLog.innerText = `${cup.currentMatch - 1}/3 matches finished`;
			if (cup.currentMatch > 3) {
				cupLog.innerText = "Cup finished";
				const cupResults = document.getElementById("cup-results");
				cupResults.innerText = "waiting for results...";
			} else {
				setTimeout(() => {
					this.createMatch();
				}, 5000);
			}
		}
	}

	createMatch() {
		const match = cup.matches[cup.currentMatch - 1];
		console.log("trying to connect to match " + match);
		gameConfig.ws = new WebSocket(
			`wss://${host}/ws/game/${match}/${localStorage.getItem("jwt")}/1/`
		);
		gameConfig.ws.onopen = () => {
			console.log("connected");
			gameConfig.isOnline = true;
			gameConfig.key = true;
			pushHistoryAndGoTo("/Game");
		};
		gameConfig.ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};

	}

	async addEventListeners() {
		const backBtn = document.getElementById("back-button");
		const joinCupBtn = document.getElementById("join-cup-btn");
		const playerN = document.getElementById("player-number");
		const cupLog = document.getElementById("cup-log");
		const sockErrMsg = document.getElementById("sock-err-msg");
		backBtn.addEventListener("click", () => {
			if (cup.ws) {
				cup.ws.close();
				cup.ws = null;
			}
		});
		joinCupBtn.addEventListener("click", async () => {
			if (!cup.ws) {
			cup.ws = new WebSocket(
				`wss://${host}/ws/game/${localStorage.getItem("jwt")}/`
			);
			} else {
				cup.ws.close();
				cup.ws = null;
				joinCupBtn.innerText = "Join";
				return;
			}
			cup.ws.onopen = () => {
				console.log("connected");
				joinCupBtn.innerText = "Cancel";
			};
			cup.ws.onmessage = (event) => {
				const data = JSON.parse(event.data);
				if (data.hasOwnProperty("waiting"))
					playerN.innerText = data.waiting;
				else if (data.hasOwnProperty("game-start")) {
					cupLog.innerText = "4/4 connected";
				}
				else if (data.hasOwnProperty("matches")) {
					cup.matches = data.matches;
					setTimeout(() => {
						this.createMatch();
					}, 5000);
				}
				else if (data.hasOwnProperty("results")) {
					console.log(data.results);
					const cupResults = document.getElementById("cup-results");
					data.results.forEach((score, index) => {
						const matchDiv = document.createElement('div');
						matchDiv.className = 'match';

						const matchHeading = document.createElement('h3');
						matchHeading.textContent = `Match ${index + 1}`;

						const player1Score = document.createElement('p');
						player1Score.textContent = `Player 1: ${score.player1_name}`;

						const player2Score = document.createElement('p');
						player2Score.textContent = `Player 2: ${score.player2_name}`;

						matchDiv.appendChild(matchHeading);
						matchDiv.appendChild(player1Score);
						matchDiv.appendChild(player2Score);
						cupResults.innerText = "";
						cupResults.appendChild(matchDiv);
					});
				}
			};
			cup.ws.onerror = (error) => {
				console.error("WebSocket error:", error);
			};
		});
	}
}
