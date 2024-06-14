import { Component } from "../library/component.js";
import { isLoggedIn } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { Nav } from "./nav.js";
import { setupDarkModeToggle } from "../utils/darkmode.js";
import { setMyUsername } from "../../index.js";

export class Register extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
	<div class="d-flex h-100 justify-content-center">
		<div style="width: 324px">
			<div class="d-flex flex-column justify-content-end login-header">
				<div class="fs-1 mb-3 mx-4 d-flex justify-content-between align-items-center">Sign up
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
						id="Content-Files-Quill-Ink--Streamline-Pixel" fill="currentColor" height="40" width="40">
						<desc>Content Files Quill Ink Streamline Icon: https://streamlinehq.com</desc>
						<title>content-files-quill-ink</title>
						<g>
							<path
								d="m20.576249999999998 2.2874999999999996 1.1400000000000001 0 0 -1.1475 1.1400000000000001 0 0 -1.1400000000000001 -6.855 0 0 1.1400000000000001 4.574999999999999 0 0 1.1475z"
								stroke-width="1"></path>
							<path d="M19.42875 2.2874999999999996h1.1475v1.1400000000000001h-1.1475Z"
								stroke-width="1"></path>
							<path d="M18.28875 3.4275h1.1400000000000001V4.574999999999999h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path
								d="M17.14875 4.574999999999999h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path d="M16.00125 5.715h1.1475v2.2874999999999996h-1.1475Z" stroke-width="1"></path>
							<path d="M16.00125 2.2874999999999996h1.1475v1.1400000000000001h-1.1475Z"
								stroke-width="1"></path>
							<path
								d="M14.861250000000002 8.0025h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path
								d="M14.861250000000002 3.4275h1.1400000000000001V4.574999999999999h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path
								d="M13.713750000000001 1.1400000000000001h2.2874999999999996v1.1475h-2.2874999999999996Z"
								stroke-width="1"></path>
							<path d="M13.713750000000001 4.574999999999999h1.1475v1.1400000000000001h-1.1475Z"
								stroke-width="1"></path>
							<path d="M12.57375 9.1425h2.2874999999999996v1.1475h-2.2874999999999996Z"
								stroke-width="1"></path>
							<path d="M12.57375 5.715h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path
								d="M12.57375 2.2874999999999996h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path
								d="M2.2912500000000002 24h10.2825v-1.1400000000000001h1.1400000000000001v-4.574999999999999h-1.1400000000000001v1.1475h-5.715v-1.1475H4.574999999999999v-1.1400000000000001H2.2912500000000002v1.1400000000000001h-1.1475v4.574999999999999h1.1475Zm1.1400000000000001 -4.5675H4.574999999999999v2.2800000000000002h2.2874999999999996v1.1475H4.574999999999999v-1.1475H3.4312500000000004Z"
								stroke-width="1"></path>
							<path d="M11.43375 6.855h1.1400000000000001v1.1475h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path d="M11.43375 3.4275h1.1400000000000001V4.574999999999999h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path
								d="M10.286249999999999 17.145h2.2874999999999996v1.1400000000000001h-2.2874999999999996Z"
								stroke-width="1"></path>
							<path
								d="m12.57375 10.290000000000001 -2.2874999999999996 0 0 -1.1475 -1.1400000000000001 0 0 -1.1400000000000001 -1.1400000000000001 0 0 3.4275 4.5675 0 0 -1.1400000000000001z"
								stroke-width="1"></path>
							<path d="M10.286249999999999 8.0025h1.1475v1.1400000000000001h-1.1475Z"
								stroke-width="1"></path>
							<path d="M10.286249999999999 4.574999999999999h1.1475v1.1400000000000001h-1.1475Z"
								stroke-width="1"></path>
							<path d="M9.14625 5.715h1.1400000000000001v2.2874999999999996h-1.1400000000000001Z"
								stroke-width="1"></path>
							<path
								d="m5.71875 14.857499999999998 3.4275 0 0 2.2874999999999996 1.1400000000000001 0 0 -2.2874999999999996 1.1475 0 0 -1.1400000000000001 -3.4275 0 0 -2.2874999999999996 -1.1475 0 0 2.2874999999999996 -3.4275 0 0 1.1400000000000001 1.1400000000000001 0 0 2.2874999999999996 1.1475 0 0 -2.2874999999999996z"
								stroke-width="1"></path>
						</g>
					</svg>
				</div>
			</div>
			<div class="">
				<form id="registerForm" novalidate>
					<div class="form-floating">
						<input type="text" id="signup-username" class="form-control rounded-0 ps-4"
							placeholder="username" required autocomplete="username" name="username">
						<label for="signup-username" class="form-label ps-4">Username</label>
					</div>
					<div class="form-floating">
						<input type="password" id="signup-password" class="form-control rounded-0 ps-4 border-top-0"
							placeholder="password" required autocomplete="new-password" name="password">
						<label for="signup-password" class="form-label ps-4">Password</label>
						<div class="ms-4 invalid-feedback">Password must be at least 5 characters</div>
					</div>
					<div class="form-floating mb-3">
						<input type="password" id="signup-password-confirm"
							class="form-control rounded-0 ps-4 border-top-0" placeholder="confirm password" required
							autocomplete="new-password" name="passwordRepeated">
						<label for="signup-password-confirm" class="form-label ps-4">Confirm
							password</label>
						<div class="ms-4 invalid-feedback">Passwords do not match</div>
					</div>
					<button class="btn btn-outline-primary rounded-0 p-3 w-100 big-btn">Sign up</button>
				</form>
				<div class="mt-4 mb-2 mx-4 text-secondary d-flex flex-column align-items-center">Already have an
					account? <a href="/Login" class="link-text" data-link>Sign&nbsp;in</a></div>
				<div class="d-flex justify-content-center" id="modeSwitch">
					<div class="p-1">
						<svg xmlns="http://www.w3.org/2000/svg" id="sunIcon" viewBox="0 0 24 24"
							id="Weather-Cloud-Sun-Fine--Streamline-Pixel" fill="currentColor" height="40" width="40"
							style="display:none">
							<desc>Weather Cloud Sun Fine Streamline Icon: https://streamlinehq.com</desc>
							<title>weather-cloud-sun-fine</title>
							<g>
								<path d="M22.8525 14.29125H24v4.5675h-1.1475Z" stroke-width="1"></path>
								<path d="M21.7125 8.57625H24v1.1400000000000001h-2.2874999999999996Z"
									stroke-width="1"></path>
								<path d="M21.7125 18.85875h1.1400000000000001v1.1475h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path d="M21.7125 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path
									d="M21.7125 2.86125h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path
									d="M20.572499999999998 20.00625h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path
									d="M20.572499999999998 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path d="M20.572499999999998 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path
									d="M2.2874999999999996 21.146250000000002h18.285v1.1400000000000001H2.2874999999999996Z"
									stroke-width="1"></path>
								<path
									d="M15.997499999999999 12.00375h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path
									d="M15.997499999999999 1.71375h1.1400000000000001v2.2874999999999996h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path
									d="M14.857499999999998 13.143749999999999h1.1400000000000001v1.1475h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path d="M11.43 4.00125h1.1400000000000001v1.1475h-1.1400000000000001Z"
									stroke-width="1"></path>
								<path d="M10.2825 2.86125h1.1475v1.1400000000000001h-1.1475Z" stroke-width="1">
								</path>
								<path
									d="m10.2825 7.428749999999999 3.4275 0 0 1.1475 2.2874999999999996 0 0 1.1400000000000001 1.1400000000000001 0 0 2.2874999999999996 3.435 0 0 -4.574999999999999 -1.1475 0 0 -1.1400000000000001 -1.1400000000000001 0 0 -1.1400000000000001 -3.4275 0 0 1.1400000000000001 -5.715 0 0 1.1400000000000001 -1.1475 0 0 1.1475 2.2874999999999996 0 0 -1.1475z"
									stroke-width="1"></path>
								<path d="M7.995 14.29125h1.1475v1.1400000000000001h-1.1475Z" stroke-width="1">
								</path>
								<path d="M6.855 13.143749999999999h1.1400000000000001v1.1475H6.855Z"
									stroke-width="1"></path>
								<path d="M6.855 8.57625h1.1400000000000001v1.1400000000000001H6.855Z"
									stroke-width="1"></path>
								<path
									d="m6.855 13.143749999999999 0 -3.4275 -1.1400000000000001 0 0 2.2874999999999996 -3.4275 0 0 1.1400000000000001 4.5675 0z"
									stroke-width="1"></path>
								<path d="M1.1400000000000001 20.00625h1.1475v1.1400000000000001H1.1400000000000001Z"
									stroke-width="1"></path>
								<path d="M1.1400000000000001 13.143749999999999h1.1475v1.1475H1.1400000000000001Z"
									stroke-width="1"></path>
								<path d="M0 14.29125h1.1400000000000001v5.715H0Z" stroke-width="1"></path>
							</g>
						</svg>
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

      fetch(`http://${location.hostname}:8000/user/register`, {
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
