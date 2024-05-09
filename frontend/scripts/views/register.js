import { Component } from "../library/component.js";
import { isLoggedIn } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { Nav } from "./nav.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";

export class Register extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<div id="registration-page">
			<div class="vh-100 d-flex align-items-center justify-content-center">
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

      fetch("http://127.0.0.1:8000/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
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
            const navbar = new Nav();
            replaceHistoryAndGoTo("/");
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
  }
}
