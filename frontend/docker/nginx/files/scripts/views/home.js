import { Component } from "../library/component.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { myUsername, isLoggedIn, host } from "../../index.js";

export class Home extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="d-flex flex-column h-100">
		<div class="d-flex flex-column justify-content-end align-items-center" id="top-screen">
			<h1 id="project-title">PONG</h1>
		</div>
		<div class="d-flex h-50 flex-column pb-5 align-self-center overflow-auto px-sm-0 px-3" id="game-menu">
			<div class="fs-5 text-danger d-none text-center" id="sock-err-msg"></div>
			<a href="/Select" class="menu-btn" data-link>
				<div class="mini-paddle p1"></div>
				<span>Play</span>
				<div class="mini-paddle p2"></div>
			</a>
			<a href="/Options" class="menu-btn" data-link>
				<div class="mini-paddle p2"></div>
				<span>Options</span>
				<div class="mini-paddle p1"></div>
			</a>
			<a href="/${myUsername.username}" class="menu-btn" id="profile-link" data-link>
				<div class="mini-paddle p1"></div>
				<span>Profile</span>
				<div class="mini-paddle p2"></div>
			</a>
			<div class="menu-btn" id="logout-button">
				<div class="mini-paddle p2"></div>
				<span>Exit</span>
				<div class="mini-paddle p1"></div>
			</div>
		</div>
	</div>
	`;
    this.render();
    this.addEventListeners();
  }


  addEventListeners() {
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", async () => {
      await fetch(`https://${host}/user-management/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          localStorage.removeItem("jwt");
          isLoggedIn.status = false;
          replaceHistoryAndGoTo("/");
        })
        .catch((error) => {
          console.log("we got an error: ", error);
        });
    });
  }
}
