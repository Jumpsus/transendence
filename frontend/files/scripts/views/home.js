import { Component } from "../library/component.js";

export class Home extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="w-100 h-100 d-flex justify-content-center align-items-center"><a href="/Game" class="btn btn-primary" data-link>Start Game</a></div>
	`;
    this.render();
  }
}
