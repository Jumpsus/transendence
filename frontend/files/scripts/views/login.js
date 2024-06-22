import { Component } from "../library/component.js";
import { isLoggedIn, host } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { setMyUsername } from "../../index.js";

export class Login extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div class="d-flex flex-column h-100 w-100 overflow-auto">
		<div class="d-flex flex-column justify-content-between align-items-center" id="top-screen">
			<a href="/Register" class="fs-4" data-link> >>> Sign up <<< </a>
			<h1 id="project-title">PONG</h1>
		</div>
		<div class="d-flex h-50 flex-column justify-content-between align-items-center">
			<form id="loginForm" novalidate>
				<button class="press-start-btn">Press start</button>
				<div class="form-floating">
					<input type="text" id="login-username" class="form-control rounded-0 text-center" placeholder="username" required
						autocomplete="username" name="username">
					<label for="login-username" class="form-label">Insert username</label>
				</div>
				<div class="form-floating">
					<input type="password" id="login-password" class="form-control rounded-0 text-center"
						placeholder="password" required autocomplete="new-password" name="password">
					<label for="login-password" class="form-label">Insert password</label>
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
    const loginForm = document.getElementById("loginForm");
    const usernameElm = document.getElementById("login-username");
    const passwordElm = document.getElementById("login-password");
    const errMsg = document.getElementById("err-msg");
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = usernameElm.value.toLowerCase();
      const password = passwordElm.value;
      if (username === "" || password === "") {
        errMsg.textContent = "Invalid username or password";
        return;
      }

      const requestBody = {
        username: username,
        password: password,
      };

      const resp = await fetch(`https://${host}/user-management/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!resp.ok) {
        errMsg.textContent = "Wrong username or password";
        return;
      } else {
        const data = await resp.json();
        localStorage.setItem("jwt", data.token);
        const loginSuccess = await setMyUsername();
        isLoggedIn.status = loginSuccess;
        if (isLoggedIn.status) replaceHistoryAndGoTo("/");
        else errMsg.textContent = "Login failed";
      }
    });
  }
}
