import { Component } from "../library/component.js";

export class Tournament extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<h1>Tournament</h1>
	`;
    this.render();
  }
}
