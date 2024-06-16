import { Component } from "../library/component.js";
import { isLoggedIn, host } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { Nav } from "./nav.js";
import { setMyUsername } from "../../index.js";

export class Register extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="d-flex flex-column h-100 w-100 overflow-auto">
		<div class="d-flex flex-column justify-content-between align-items-center" id="top-screen">
			<div class="fs-4 text-center">Already have an
			account? <a href="/Login" class="link-text" data-link>Sign&nbsp;in</a></div>
		<h1 id="project-title">PONG</h1>
		</div>
			<div class="d-flex h-50 flex-column justify-content-between align-items-center">
				<form id="registerForm" novalidate>
					<button class="press-start-btn">Press start</button>
					<div class="form-floating">
						<input type="text" id="signup-username" class="form-control rounded-0" placeholder="username"
							required autocomplete="username" name="username">
						<label for="signup-username" class="form-label">Insert username</label>
					</div>
					<div class="form-floating">
						<input type="password" id="signup-password" class="form-control rounded-0"
							placeholder="password" required autocomplete="new-password" name="password">
						<label for="signup-password" class="form-label">Insert password</label>
						<div class="ms-4 invalid-feedback">Password must be at least 5 characters</div>
					</div>
					<div class="form-floating mb-3">
						<input type="password" id="signup-password-confirm" class="form-control rounded-0"
							placeholder="confirm password" required autocomplete="new-password" name="passwordRepeated">
						<label for="signup-password-confirm" class="form-label">Confirm
							password</label>
						<div class="ms-4 invalid-feedback">Passwords do not match</div>
					</div>
				</form>
				<div class="fs-4 pb-5">© 42Bkk 2567</div>
			</div>
	</div>
			`;
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const cardBody = document.querySelector(".card-body");
    const registerForm = document.getElementById("registerForm");
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const usernameElm = document.getElementById("signup-username");
      const passwordElm = document.getElementById("signup-password");
      const passwordConfirmElm = document.getElementById(
        "signup-password-confirm"
      );

      const username = usernameElm.value.toLowerCase();
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

      fetch(`https://${host}/user-management/user/register`, {
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
            localStorage.setItem("jwt", data.token);
            return setMyUsername();
          }
        })
        .then((resp) => {
          isLoggedIn.status = resp;
          if (isLoggedIn.status) replaceHistoryAndGoTo("/");
          else console.log("register failed");
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    });
  }
}
