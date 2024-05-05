import { Component } from "../library/component.js";

export class Nav extends Component {
  constructor() {
    super(document.getElementById("navigation-wrapper"));
    this.view = `
	<nav class="navbar navbar-expand sticky-top navbar-dark">
		<div class="container-md">
			<a href="" class="navbar-brand">Ping Pong</a>
			<ul class="navbar-nav d-flex align-items-center">
				<li class="nav-item"><a href="/" class="nav-link active" data-link>Home</a></li>
				<li class="nav-item"><a href="/Tournament" class="nav-link" data-link>Tournament</a></li>
				<li class="nav-item"><a href="/Chat" class="nav-link" data-link>Chat</a></li>
				<li class="nav-item"><a href="/Profile" class="nav-link" data-link><img src="assets/profile.png" alt="profile image"
							class="border border-3 border-success rounded-circle"
							style="width: 50px; height: 50px; object-fit: cover;"></a></li>
			</ul>
		</div>
	</nav>
	`;
    this.render();
  }
}
