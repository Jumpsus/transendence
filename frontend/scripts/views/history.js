import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";

export class MatchHistory extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
		<div>Match History</div>
		`;
    this.render();
    this.setupEventListeners();
  }

  render() {
    super.render();
    makeLinkActive(document.getElementById("profileMenu"));
  }

  setupEventListeners() {}
}
