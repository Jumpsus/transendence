import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { Profile } from "./profile.js";

export class MatchHistory extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
		<h4>Match History</h4>
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
