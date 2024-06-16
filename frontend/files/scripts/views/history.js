import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { Profile } from "./profile.js";

export class MatchHistory extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
	<div id="match-history-table" class="d-flex justify-content-between w-100">
	<div id="name-column">
		<div>Opponent</div>
		<div>Leo</div>
		<div>Preed</div>
	</div>
	<div id="score-column" class="d-flex flex-column align-items-center">
		<div>Score</div>
		<div>1:11</div>
		<div>11:10</div>
	</div>
	<div id="result-column" class="d-flex flex-column align-items-end align-items-center">
		<div>Result</div>
		<div>Won</div>
		<div>Lost</div>
	</div>
	<div id="date-column" class="d-none d-sm-flex align-items-end flex-column">
		<div>Date</div>
		<div>01-01-02</div>
		<div>01-02-03</div>
	</div>
</div>
		`;
    this.render();
    this.setupEventListeners();
  }

  render() {
	if (!document.getElementById("profileHeader"))
		new Profile;
    super.render();
    makeLinkActive(document.getElementById("profileMenu"));
  }

  setupEventListeners() {}
}
