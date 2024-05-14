import { Component } from "../library/component.js";
import { isLoggedIn } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { Nav } from "./nav.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";

export class Register extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
			<div class="d-flex h-100 align-items-center justify-content-center">
				<div class="card rounded-5" style="width: 324px">
					<div class="card-header rounded-top-5 rounded-bottom-5">
						<h1 class="mt-5 mb-3 mx-4 d-flex justify-content-between">Sign up<span>🏓</span></h1>
					</div>
					<div class="card-body">
						<form id="registerForm" novalidate>
							<div class="form-floating mb-2">
								<input type="text" id="signup-username" class="form-control rounded-pill ps-4"
									placeholder="username" required autocomplete="username" name="username">
								<label for="signup-username" class="form-label ps-4">Username</label>
							</div>
							<div class="form-floating mb-2">
								<input type="password" id="signup-password" class="form-control rounded-pill ps-4"
									placeholder="password" required autocomplete="new-password" name="password">
								<label for="signup-password" class="form-label ps-4">Password</label>
								<div class="ms-4 invalid-feedback">Password must be at least 5 characters</div>
							</div>
							<div class="form-floating mb-3">
								<input type="password" id="signup-password-confirm" class="form-control rounded-pill ps-4"
									placeholder="confirm password" required autocomplete="new-password" name="passwordRepeated">
								<label for="signup-password-confirm" class="form-label ps-4">Confirm
									password</label>
								<div class="ms-4 invalid-feedback">Passwords do not match</div>
							</div>
							<button class="btn btn-outline-primary rounded-pill p-3 w-100 fw-bold">Sign in</button>
						</form>
						<div class="mt-4 mb-2 mx-4 text-secondary">Already have an account? <a href="/Login" class="fw-semibold"
							data-link>Sign&nbsp;in</a></div>
						<div class="d-flex justify-content-center" id="modeSwitch">
							<div class="bg-body-tertiary rounded-circle p-3">
								<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-sun" id="sunIcon" viewBox="0 0 16 16">
									<path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
															</svg>
								<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="grey" class="bi bi-moon-stars" id="moonIcon" viewBox="0 0 16 16">
								  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
								  <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.73 1.73 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.73 1.73 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.73 1.73 0 0 0 1.097-1.097zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.16 1.16 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.16 1.16 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732z"/>
								</svg>
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
    const cardBody = document.querySelector(".card-body");
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const usernameElm = document.getElementById("signup-username");
      const passwordElm = document.getElementById("signup-password");
      const passwordConfirmElm = document.getElementById(
        "signup-password-confirm"
      );

      const username = usernameElm.value;
      const password = passwordElm.value;
      const passwordConfirm = passwordConfirmElm.value;
      let formIsValid = true;

      if (username === "") {
        usernameElm.classList.add("is-invalid");
        formIsValid = false;
      } else {
        usernameElm.classList.remove("is-invalid");
      }
      if (password.length < 5) {
        passwordElm.classList.add("is-invalid");
        formIsValid = false;
      } else {
        passwordElm.classList.remove("is-invalid");
      }
      if (password !== passwordConfirm) {
        passwordConfirmElm.classList.add("is-invalid");
        formIsValid = false;
      } else {
        passwordConfirmElm.classList.remove("is-invalid");
      }
      if (!formIsValid) {
        return;
      }

      const requestBody = {
        username: username,
        password: password,
      };

      fetch("https://localhost:9000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
		credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.code === "12") {
            if (document.getElementById("error-alert")) return;
            const errorAlert = document.createElement("div");
            errorAlert.id = "error-alert";
            errorAlert.classList.add("text-center", "pt-2", "text-danger");
            errorAlert.textContent = data.message;
            registerForm.insertAdjacentElement("afterend", errorAlert);
          } else {
            console.log(data);
            isLoggedIn.status = true;
            replaceHistoryAndGoTo("/");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
  }
}
