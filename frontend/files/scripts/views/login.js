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
			<div class="fs-4 text-center">Don't have an
			account? <a href="/Register" class="link-text" data-link>Sign&nbsp;up</a></div>
			<h1 id="project-title">PONG</h1>
		</div>
		<div class="d-flex h-50 flex-column justify-content-between align-items-center">
			<form id="loginForm" novalidate>
				<button class="press-start-btn">Press start</button>
				<div class="form-floating">
					<input type="text" id="login-username" class="form-control rounded-0" placeholder="username" required
						autocomplete="username" name="username">
					<label for="login-username" class="form-label">Insert username</label>
				</div>
				<div class="form-floating">
					<input type="password" id="login-password" class="form-control border-top-0 rounded-0"
						placeholder="password" required autocomplete="new-password" name="password">
					<label for="login-password" class="form-label">Insert password</label>
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
    const loginForm = document.getElementById("loginForm");
    loginForm.addEventListener("submit", async function (event) {
      event.preventDefault();
      const usernameElm = document.getElementById("login-username");
      const passwordElm = document.getElementById("login-password");

      const username = usernameElm.value.toLowerCase();
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

      fetch(`https://${host}/user-management/user/login`, {
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
          localStorage.setItem("jwt", data.token);
          return setMyUsername();
        })
        .then((resp) => {
          isLoggedIn.status = resp;
          if (isLoggedIn.status) replaceHistoryAndGoTo("/");
          else console.log("login failed");
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
