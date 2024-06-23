import { Component } from "../library/component.js";

export class NotExist extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="w-100 h-100 d-flex flex-column justify-content-center align-items-center">
		<div style="font-size: 100px">404</div>
		<div class="fs-1 text-center">Page does not exist</div>
    <a href="/" class="fs-1 text-center" id="fof-home-btn">go back</a>
	</div>
	`;
    this.render();
  }
}
