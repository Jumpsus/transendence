import { Component } from "../library/component.js";

export class Friends extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
	<div class="d-flex justify-content-between">
				<div class="fs-3">5 Friends</div>
				<form action="">
					<input type="text" class="form-control rounded-pill" placeholder="Find a friend">
					</input>
				</form>
			</div>
			<div class="d-flex flex-wrap mt-3 gap-3">
				<div>
					<a href=""><img src="assets/profile.png" class="rounded-circle border border-4 border-success"
							width="100" height="100" alt="..."></a>
					<div class="d-flex justify-content-center">
						<div>naruto</div>
					</div>
				</div>
				<div>
					<a href=""><img src="assets/profile.png" class="rounded-circle" width="100" height="100"
							alt="..."></a>
					<div class="d-flex justify-content-center">
						<div>snitch</div>
					</div>
				</div>
				<div class="d-flex align-items-center flex-column">
					<a href=""><img src="assets/profile.png" class="rounded-circle" width="100" height="100"
							alt="..."></a>
					<div class="d-flex justify-content-center">
						<div>anonymous</div>
					</div>
				</div>
				<div>
					<a href=""><img src="assets/profile.png" class="rounded-circle border border-4 border-success"
							width="100" height="100" alt="..."></a>
					<div class="d-flex justify-content-center">
						<div>pickachu</div>
					</div>
				</div>
				<div>
					<a href=""><img src="assets/profile.png" class="rounded-circle" width="100" height="100"
							alt="..."></a>
					<div class="d-flex justify-content-center">
						<div>logan</div>
					</div>
				</div>
			</div>
		`;
    this.render();
	this.setupEventListeners();
  }

  setupEventListeners() {
	
}
}
