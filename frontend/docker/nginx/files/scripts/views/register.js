import { Component } from "../library/component.js";
import { isLoggedIn, host } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { setMyUsername } from "../../index.js";

export class Register extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="d-flex flex-column h-100 w-100 overflow-auto">
		<div class="d-flex flex-column justify-content-between align-items-center" id="top-screen">
			<a href="/Login" class="fs-4" data-link> >>> Sign in <<< </a>
		<h1 id="project-title">PONG</h1>
		</div>
			<div class="d-flex h-50 flex-column justify-content-between align-items-center">
				<form id="registerForm" novalidate>
					<button class="press-start-btn">Press start</button>
					<div class="form-floating">
						<input type="text" id="signup-username" class="form-control rounded-0 text-center" placeholder="username"
							required autocomplete="username" name="username">
						<label for="signup-username" class="form-label">Insert username</label>
					</div>
					<div class="form-floating">
						<input type="password" id="signup-password" class="form-control rounded-0 text-center"
							placeholder="password" required autocomplete="new-password" name="password">
						<label for="signup-password" class="form-label">Insert password</label>
						<div class="invalid-feedback text-center">Password must have at least 5 characters</div>
					</div>
					<div class="form-floating">
						<input type="password" id="signup-password-confirm" class="form-control rounded-0 text-center"
							placeholder="confirm password" required autocomplete="new-password" name="passwordRepeated">
						<label for="signup-password-confirm" class="form-label">Confirm
							password</label>
						<div class="invalid-feedback text-center">Passwords do not match</div>
					</div>
					<div class="text-center text-danger" id="err-msg"></div>
				</form>
				<div class="fs-4 pb-5">© 42Bkk 2567</div>
			</div>
	</div>
			`;
    this.render();
    this.setupEventListeners();
  }

  async setupEventListeners() {
    const registerForm = document.getElementById("registerForm");
    const usernameElm = document.getElementById("signup-username");
    const passwordElm = document.getElementById("signup-password");
    const passwordConfirmElm = document.getElementById(
      "signup-password-confirm"
    );
    const errMsg = document.getElementById("err-msg");
    registerForm.addEventListener("submit", async function (event) {
      event.preventDefault();
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

      const resp = await fetch(
        `https://${host}/user-management/user/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
      if (!resp.ok) {
        errMsg.textContent = data.message;
        return;
      } else {
        const data = await resp.json();
        localStorage.setItem("jwt", data.token);
        const loginSuccess = setMyUsername();
        isLoggedIn.status = loginSuccess;
        if (isLoggedIn.status) replaceHistoryAndGoTo("/");
        else errMsg.textContent = "Register failed";
      }
    });
  }
}
