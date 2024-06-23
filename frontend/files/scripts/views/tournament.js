import { Component } from "../library/component.js";
import { Home } from "./home.js";
import { myUsername } from "../../index.js";
import { host } from "../../index.js";
import { pushHistoryAndGoTo, replaceHistoryAndGoTo } from "../utils/router.js";
import { gameConfig, gameState } from "../game/setup.js";

export const cup = { ws: null, matches: [], currentMatch: 1 };

export function closeCupWs() {
	cup.ws.close();
	console.log("closing cup ws");
	cup.ws = null;
	cup.matches = [];
	cup.currentMatch = 1;
}

function resetCup() {
	cup.ws = null;
	cup.matches = [];
	cup.currentMatch = 1;
}

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
			 <div class="d-flex flex-column justify-content-center text-center" id="cup-results"></div>
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
				closeCupWs();
			}
		});
		joinCupBtn.addEventListener("click", async () => {
			if (!cup.ws) {
				cup.ws = new WebSocket(
					`wss://${host}/ws/game/${localStorage.getItem("jwt")}/`
				);
			} else {
				closeCupWs();
				joinCupBtn.innerText = "Join";
				playerN.innerText = "0";
				return;
			}
			cup.ws.onopen = () => {
				console.log("connected");
				joinCupBtn.innerText = "Cancel";
			};
			cup.ws.onmessage = (event) => {
				console.log(event.data);
				const data = JSON.parse(event.data);
				if (data.hasOwnProperty("waiting"))
					playerN.innerText = data.waiting;
				else if (data.hasOwnProperty("game-start")) {
					cupLog.innerText = "4/4 connected";
				}
				else if (data.hasOwnProperty("matches")) {
					cup.matches = data.matches;
					setTimeout(() => {
						if (!cup.ws) {
							resetCup();
							alert("Someone disconnected");
							return;
						}
						this.createMatch();
					}, 5000);
				}
				else if (data.hasOwnProperty("results")) {
					console.log(data.results);
					const cupResults = document.getElementById("cup-results");
					cupResults.innerText = "";
					data.results.forEach((score, index) => {
						const matchDiv = document.createElement('div');
						matchDiv.className = 'match';

						const matchHeading = document.createElement('h3');
						matchHeading.textContent = `Match ${index + 1}`;
						matchDiv.appendChild(matchHeading);

						Object.entries(score).forEach(([playerName, playerScore]) => {
							const playerScoreElement = document.createElement('p');
							playerScoreElement.textContent = `${playerName}: ${playerScore}`;
							matchDiv.appendChild(playerScoreElement);
						});
					
						cupResults.appendChild(matchDiv);

					});
					resetCup();
				}
				else if (data.hasOwnProperty("Error")) {
					if (gameConfig.animationID) {
						cancelAnimationFrame(gameConfig.animationID);
					}

					if (gameConfig.ws) {
						console.log("closing game ws");
						gameConfig.ws.close();
						gameConfig.ws = null;
						alert(data.Error);
					}
					resetCup();
					replaceHistoryAndGoTo("/Tournament");
				}
			};
		});
	}
}
