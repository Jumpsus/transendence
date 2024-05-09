import { Component } from "../library/component.js";
import { isLoggedIn } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { Nav } from "./nav.js";
import {
  setupDarkModeToggle,
} from "../utils/darkmode.js";

export class Login extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<div id="login-page">
			<div class="min-vh-100 d-flex align-items-center justify-content-center">
				<div class="card rounded-5" style="width: 324px">
					<div class="card-header rounded-top-5 rounded-bottom-5">
						<h1 class="mt-5 mb-3 mx-4 d-flex justify-content-between">Sign in<span>🏓</span></h1>
					</div>
					<div class="card-body">
						<form id="loginForm" novalidate>
							<div class="form-floating mb-2">
								<input type="text" id="login-username" class="form-control rounded-pill ps-4"
									placeholder="username" required autocomplete="username" name="username">
								<label for="login-username" class="form-label ps-4">Username</label>
							</div>
							<div class="form-floating mb-3">
								<input type="password" id="login-password" class="form-control rounded-pill ps-4"
									placeholder="password" required autocomplete="new-password" name="password">
								<label for="login-password" class="form-label ps-4">Password</label>
							</div>
							<button class="btn btn-outline-primary rounded-pill p-3 w-100 fw-bold">Sign in</button>
						</form>
						<div class="mt-4 mb-2 mx-4 text-secondary">Don't have an account? <a href="/Register"
								class="fw-semibold" data-link>Sign&nbsp;up</a></div>
						<div class="form-check form-switch fs-4 d-flex justify-content-center">
							<input class="form-check-input bg-body-secondary border-0" type="checkbox" role="switch" id="modeSwitch"
								data-bs-theme-value>
						</div>
					</div>
				</div>
			</div>
		</div>
	`;
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
	setupDarkModeToggle();
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const usernameElm = document.getElementById("login-username");
      const passwordElm = document.getElementById("login-password");

      const username = usernameElm.value;
      const password = passwordElm.value;
      if (username === "") usernameElm.classList.add("is-invalid");
      else usernameElm.classList.remove("is-invalid");
      if (password === "") passwordElm.classList.add("is-invalid");
      else passwordElm.classList.remove("is-invalid");
      if (username === "" || password === "") return;

      const requestBody = {
        username: username,
        password: password,
      };

      fetch("http://127.0.0.1:8000/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          isLoggedIn.status = true;
          const navbar = new Nav();
          replaceHistoryAndGoTo("/");
        })
        .catch((error) => {
          console.log(error);
          if (document.getElementById("error-alert")) return;
          const errorAlert = document.createElement("div");
          errorAlert.id = "error-alert";
          errorAlert.classList.add("text-center", "pt-2", "text-danger");
          errorAlert.textContent = "Invalid username or password";
          loginForm.insertAdjacentElement("afterend", errorAlert);
        });
    });
  }

  
}
