import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { Profile } from "./profile.js";
import { host } from "../../index.js";

export class MatchHistory extends Component {
	constructor() {
		super(document.getElementById("profile-wrapper"));
		this.view = `
	<div id="match-history-table" class="d-flex justify-content-between w-100">
	<div id="name-column">
		<div>Opponent</div>
		<div>Leo</div>
	</div>
	<div id="score-column">
		<div>Score</div>
		<div>1:11</div>
	</div>
	<div id="result-column">
		<div>Result</div>
		<div>Won</div>
	</div>
	<div id="date-column" class="d-none d-sm-block">
		<div>Date</div>
		<div>01-01-02</div>
	</div>
</div>
		`;
		this.render();
		this.setupEventListeners();
	}

	async render() {
		const nameColumn = document.getElementById("name-column");
		const scoreColumn = document.getElementById("score-column");
		const resultColumn = document.getElementById("result-column");
		const dateColumn = document.getElementById("date-column");
		if (!document.getElementById("profileHeader")) new Profile();
		super.render();
		makeLinkActive(document.getElementById("profileMenu"));
		const resp = await fetch(`https://${host}/user-management/user/getmatchhistory`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("jwt")}`,
			},
		})
		if (!resp.ok) {
			console.log("Error fetching match history");
			return;
		}
		const data = await resp.json();
		console.log(data);

		if (data.length === 0) {
			console.log("No match history");
			return;
		}
		else {
			data.match_history.forEach(match => {
				const opponent = document.createElement('a');
				opponent.textContent = match.opponent;
				opponent.href = `/${match.opponent}`;
				nameColumn.appendChild(opponent);

				const score = document.createElement('div');
				score.textContent = match.score;
				scoreColumn.appendChild(score);

				const result = document.createElement('div');
				result.textContent = match.result;
				resultColumn.appendChild(result);

				const data = document.createElement('div');
				data.textContent = match.date;
				dateColumn.appendChild(data);
			});
		}
	}

	setupEventListeners() { }
}
