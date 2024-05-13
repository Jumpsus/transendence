import { Component } from "../library/component.js";

export class NotExist extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<h1>Page does not exist</h1>
	`;
    this.render();
  }
}
