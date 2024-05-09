import { Component } from "../library/component.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";

export class Nav extends Component {
  constructor() {
    super(document.getElementById("navigation-wrapper"));
    this.view = `
		<div class="container-lg d-flex flex-nowrap bg-body" style="min-height: 70px;">
			<a href="" class="navbar-brand w-100">Ping Pong</a>
			<button class="navbar-toggler border-0" type="button" data-bs-toggle="offcanvas"
				data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
				<span class="navbar-toggler-icon"></span>
			</button>
			<div class="offcanvas offcanvas-end w-100 border-0" tabindex="-1" id="offcanvasNavbar"
				aria-labelledby="offcanvasNavbarLabel">
				<div class="offcanvas-header">
					<button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
				</div>
				<div class="offcanvas-body">
					<ul class="navbar-nav d-flex align-items-center">
						<div class="form-check form-switch fs-3 m-0"><input
								class="form-check-input bg-body-secondary border-0" type="checkbox" role="switch"
								id="modeSwitch" data-bs-theme-value><span class="d-sm-none">🌚</span>
						</div>
						<li class="nav-item"><a href="/" class="nav-link" data-link>Home</a></li>
						<li class="nav-item"><a href="/Tournament" class="nav-link" data-link>Tournament</a></li>
						<li class="nav-item"><a href="/Chat" class="nav-link" data-link>Chat</a></li>
						<li class="nav-item"><a href="/Profile" class="nav-link" data-link><img src="assets/profile.png"
									alt="profile image" class="rounded-circle" width=40
									height=40></a></li>
					</ul>
				</div>
			</div>
		</div>
	`;
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    setupDarkModeToggle();
  }
}
