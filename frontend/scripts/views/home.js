import { Component } from "../library/component.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<h1>Home</h1>
	`;
    this.render();
  }
}
