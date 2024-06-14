import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { Profile } from "./profile.js";

export class MatchHistory extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
	<table class="history-table w-100">
		<thead>
			<tr>
				<th>Opponent</th>
				<th>Score</th>
				<th>Result</th>
			</tr>
		</thead>
		<tbody id="matchHistory">
			<tr title="10-02-24">
				<td class="table-opponent">
					<div>john</div>
				</td>
				<td class="table-score"><span>11</span><span>:</span><span>4</span></td>
				<td class="table-win">Won</td>
			</tr>
			<tr title="10-02-24">
				<td class="table-opponent">
					<div>Leo</div>
				</td>
				<td class="table-score"><span>9</span><span>:</span><span>11</span></td>
				<td class="table-lose">Lost</td>
			</tr>
		</tbody>
	</table>
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
