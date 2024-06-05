import { Component } from "../library/component.js";
import { isLoggedIn } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { Nav } from "./nav.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";
import { setMyUsername } from "../../index.js";

export class Login extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="d-flex h-100 justify-content-center">
	<div class="" style="width: 324px">
		<div class="d-flex flex-column justify-content-end login-header">
			<div class="fs-1 mb-3 mx-4 d-flex justify-content-between align-items-center">Sign in
				<svg class="align-self-center" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
					fill="currentColor" id="Interface-Essential-Iris-Scan--Streamline-Pixel" height="38"
					width="38">
					<desc>Interface Essential Iris Scan Streamline Icon: https://streamlinehq.com</desc>
					<title>interface-essential-iris-scan</title>
					<g>
						<path d="M22.86 19.4325H24v3.4275h-1.1400000000000001Z" stroke-width="1"></path>
						<path d="M22.86 10.290000000000001H24v3.4275h-1.1400000000000001Z" stroke-width="1">
						</path>
						<path d="M22.86 1.1475H24V4.574999999999999h-1.1400000000000001Z" stroke-width="1">
						</path>
						<path d="M21.7125 13.7175h1.1475v1.1400000000000001h-1.1475Z" stroke-width="1"></path>
						<path d="M21.7125 9.1425h1.1475v1.1475h-1.1475Z" stroke-width="1"></path>
						<path d="M19.4325 0h3.4275v1.1475h-3.4275Z" stroke-width="1"></path>
						<path d="M19.4325 22.86h3.4275V24h-3.4275Z" stroke-width="1"></path>
						<path
							d="M20.572499999999998 14.857499999999998h1.1400000000000001v1.1475h-1.1400000000000001Z"
							stroke-width="1"></path>
						<path
							d="M20.572499999999998 8.0025h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
							stroke-width="1"></path>
						<path d="M18.285 16.005h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"
							stroke-width="1"></path>
						<path
							d="M18.285 6.862500000000001h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"
							stroke-width="1"></path>
						<path d="M16.005 17.145h2.2800000000000002v1.1400000000000001h-2.2800000000000002Z"
							stroke-width="1"></path>
						<path d="M16.005 5.715h2.2800000000000002v1.1475h-2.2800000000000002Z" stroke-width="1">
						</path>
						<path
							d="M16.005 9.1425h-1.1475v-1.1400000000000001h-1.1400000000000001V6.862500000000001h-3.4275v1.1400000000000001h-1.1475v1.1400000000000001h-1.1400000000000001v1.1475H6.862500000000001v3.4275h1.1400000000000001v1.1400000000000001h1.1400000000000001v1.1475h1.1475v1.1400000000000001h3.4275v-1.1400000000000001h1.1400000000000001v-1.1475h1.1475v-1.1400000000000001h1.1400000000000001v-3.4275h-1.1400000000000001Zm-2.2874999999999996 3.435h-1.1475v1.1400000000000001h-1.1400000000000001v-1.1400000000000001h-1.1400000000000001v-1.1475h1.1400000000000001v-1.1400000000000001h1.1400000000000001v1.1400000000000001h1.1475Z"
							stroke-width="1"></path>
						<path d="M8.0025 18.285h8.0025v1.1475H8.0025Z" stroke-width="1"></path>
						<path d="M8.0025 4.574999999999999h8.0025v1.1400000000000001H8.0025Z" stroke-width="1">
						</path>
						<path d="M5.715 17.145h2.2874999999999996v1.1400000000000001H5.715Z" stroke-width="1">
						</path>
						<path d="M5.715 5.715h2.2874999999999996v1.1475H5.715Z" stroke-width="1"></path>
						<path d="M3.4275 16.005h2.2874999999999996v1.1400000000000001H3.4275Z" stroke-width="1">
						</path>
						<path d="M3.4275 6.862500000000001h2.2874999999999996v1.1400000000000001H3.4275Z"
							stroke-width="1"></path>
						<path d="M1.1475 22.86H4.574999999999999V24H1.1475Z" stroke-width="1"></path>
						<path
							d="M2.2874999999999996 14.857499999999998h1.1400000000000001v1.1475H2.2874999999999996Z"
							stroke-width="1"></path>
						<path
							d="M2.2874999999999996 8.0025h1.1400000000000001v1.1400000000000001H2.2874999999999996Z"
							stroke-width="1"></path>
						<path d="M1.1475 0H4.574999999999999v1.1475H1.1475Z" stroke-width="1"></path>
						<path d="M1.1475 13.7175h1.1400000000000001v1.1400000000000001H1.1475Z"
							stroke-width="1"></path>
						<path d="M1.1475 9.1425h1.1400000000000001v1.1475H1.1475Z" stroke-width="1"></path>
						<path d="M0 19.4325h1.1475v3.4275H0Z" stroke-width="1"></path>
						<path d="M0 10.290000000000001h1.1475v3.4275H0Z" stroke-width="1"></path>
						<path d="M0 1.1475h1.1475V4.574999999999999H0Z" stroke-width="1"></path>
					</g>
				</svg>
			</div>
		</div>
		<div class="">
			<form id="loginForm" novalidate>
				<div class="form-floating">
					<input type="text" id="login-username" class="form-control rounded-0 ps-4"
						placeholder="username" required autocomplete="username" name="username">
					<label for="login-username" class="form-label ps-4">Username</label>
				</div>
				<div class="form-floating mb-3">
					<input type="password" id="login-password" class="form-control border-top-0 rounded-0 ps-4"
						placeholder="password" required autocomplete="new-password" name="password">
					<label for="login-password" class="form-label ps-4">Password</label>
				</div>
				<button class="btn btn-outline-primary rounded-0 p-3 w-100 big-btn">Sign in</button>
			</form>
			<div class="mt-4 mb-2 mx-4 text-secondary d-flex flex-column align-items-center">Don't have an
				account? <a href="/Register" class="link-text" data-link>Sign&nbsp;up</a></div>
			<div class="d-flex justify-content-center" id="modeSwitch">
				<div class="p-1">
					<svg xmlns="http://www.w3.org/2000/svg" id="sunIcon"  viewBox="0 0 24 24" id="Weather-Cloud-Sun-Fine--Streamline-Pixel" fill="currentColor" height="40" width="40" style="display:none"><desc>Weather Cloud Sun Fine Streamline Icon: https://streamlinehq.com</desc><title>weather-cloud-sun-fine</title><g><path d="M22.8525 14.29125H24v4.5675h-1.1475Z"  stroke-width="1"></path><path d="M21.7125 8.57625H24v1.1400000000000001h-2.2874999999999996Z"  stroke-width="1"></path><path d="M21.7125 18.85875h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.7125 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.7125 2.86125h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 20.00625h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.572499999999998 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M2.2874999999999996 21.146250000000002h18.285v1.1400000000000001H2.2874999999999996Z"  stroke-width="1"></path><path d="M15.997499999999999 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M15.997499999999999 1.71375h1.1400000000000001v2.2874999999999996h-1.1400000000000001Z"  stroke-width="1"></path><path d="M14.857499999999998 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M11.43 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M10.2825 2.86125h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="m10.2825 7.428749999999999 3.4275 0 0 1.1475 2.2874999999999996 0 0 1.1400000000000001 1.1400000000000001 0 0 2.2874999999999996 3.435 0 0 -4.574999999999999 -1.1475 0 0 -1.1400000000000001 -1.1400000000000001 0 0 -1.1400000000000001 -3.4275 0 0 1.1400000000000001 -5.715 0 0 1.1400000000000001 -1.1475 0 0 1.1475 2.2874999999999996 0 0 -1.1475z"  stroke-width="1"></path><path d="M7.995 14.29125h1.1475v1.1400000000000001h-1.1475Z"  stroke-width="1"></path><path d="M6.855 13.143749999999999h1.1400000000000001v1.1475H6.855Z"  stroke-width="1"></path><path d="M6.855 8.57625h1.1400000000000001v1.1400000000000001H6.855Z"  stroke-width="1"></path><path d="m6.855 13.143749999999999 0 -3.4275 -1.1400000000000001 0 0 2.2874999999999996 -3.4275 0 0 1.1400000000000001 4.5675 0z"  stroke-width="1"></path><path d="M1.1400000000000001 20.00625h1.1475v1.1400000000000001H1.1400000000000001Z"  stroke-width="1"></path><path d="M1.1400000000000001 13.143749999999999h1.1475v1.1475H1.1400000000000001Z"  stroke-width="1"></path><path d="M0 14.29125h1.1400000000000001v5.715H0Z"  stroke-width="1"></path></g></svg>
					<svg width="40" height="40" viewBox="0 0 28 30" fill="currentColor" id="moonIcon"
						transform="translate(0, 3)" xmlns="http://www.w3.org/2000/svg">
						<path fill-rule="evenodd" clip-rule="evenodd"
							d="M8 2H16V4H14V6H12V4H8V2ZM6 6V4H8V6H6ZM6 16H4V6H6V16ZM8 18H6V16H8V18ZM10 20H8V18H10V20ZM20 20V22H10V20H20ZM22 18V20H20V18H22ZM20 14H22V18H24V10H22V12H20V14ZM14 14V16H20V14H14ZM12 12H14V14H12V12ZM12 12V6H10V12H12Z" />
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

      fetch(`https://${location.host}:9000/user/login`, {
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
