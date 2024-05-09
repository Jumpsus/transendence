import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { isLoggedIn } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";

export class Settings extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
		<div class="container mt-3">
			<div class="col">
				<h4 class="mb-4">Personal information</h4>
				<form class="row g-3">
					<div class="col-sm-6">
						<label for="personal-name" class="form-label">First Name</label>
						<input type="text" class="form-control" id="personal-name" placeholder="John" disabled>
					</div>
					<div class="col-sm-6">
						<label for="personal-lastname" class="form-label">Last name</label>
						<input type="text" class="form-control" id="personal-lastname" placeholder="Appleseed"
							disabled>
					</div>
					<div class="col-sm-6">
						<label for="personal-phone" class="form-label">Tel</label>
						<input type="tel" class="form-control" id="personal-phone" placeholder="094-047-5891"
							disabled>
					</div>
					<div class="col-sm-6">
						<label for="personal-email" class="form-label">Email</label>
						<input type="email" class="form-control" id="personal-email"
							placeholder="leo.silveri@mail.ru" disabled>
					</div>
					<div class="col-sm-6">
						<label for="personal-tag" class="form-label">Tag</label>
						<div>
							<div class="input-group">
								<span class="input-group-text">@</span>
								<input class="form-control" type="text" id="personal-tag" name="username"
									placeholder="pelmeshkaa" disabled>
							</div>
						</div>
					</div>
					<div class="d-flex justify-content-end">
						<button type="button" class="btn btn-secondary" id="edit-button">Edit</button>
						<button type="submit" class="btn btn-primary me-2" style="display: none;"
							id="save-button">Save</button>
						<button type="button" class="btn btn-secondary" style="display: none;"
							id="reset-button">Cancel</button>
					</div>
				</form>
			</div>
			<hr class="my-4">
			<div class="col">
				<h4 class="mb-4">Account information</h4>
				<div class="row g-3">
					<form class="col-sm-6">
						<div>
							<label for="profile-username" class="form-label">Username</label>
							<input type="text" class="form-control" id="profile-username"
								placeholder="windoshopper95" disabled>
						</div>
						<div class="d-flex justify-content-end mt-3">
							<button type="button" class="btn btn-secondary" id="edit-username-button">Edit</button>
							<button type="submit" class="btn btn-primary me-2" style="display: none;"
								id="save-username-button">Save</button>
							<button type="button" class="btn btn-secondary" style="display: none;"
								id="reset-username-button">Cancel</button>
						</div>
					</form>
					<form class="col-sm-6">
						<div>
							<label for="profile-password" class="form-label">Password</label>
							<input type="password" class="form-control" id="profile-password" disabled>
						</div>
						<div class="d-flex justify-content-end mt-3">
							<button type="button" class="btn btn-secondary" id="edit-password-button">Edit</button>
							<button type="submit" class="btn btn-primary me-2" style="display: none;"
								id="save-password-button">Save</button>
							<button type="button" class="btn btn-secondary" style="display: none;"
								id="reset-password-button">Cancel</button>
						</div>
					</form>
				</div>
			</div>
			<hr class="my-4">
			<div class="d-flex justify-content-end">
				<button type="button" class="btn btn-outline-danger" id="logout-button">Log
					out</button>
			</div>
		</div>
		`;
    this.render();
    this.setupEventListeners();
  }

  render() {
    super.render();
    makeLinkActive(document.getElementById("profileMenu"));
  }

  setupEventListeners() {
    const usernameField = document.getElementById("profile-username");
    const passwordField = document.getElementById("profile-password");
    const nameField = document.getElementById("personal-name");
    const lastNameField = document.getElementById("personal-lastname");
    const emailField = document.getElementById("personal-email");
    const phoneField = document.getElementById("personal-phone");
    const tagField = document.getElementById("personal-tag");
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");
    const cancelButton = document.getElementById("reset-button");
    const editUsernameButton = document.getElementById("edit-username-button");
    const saveUsernameButton = document.getElementById("save-username-button");
    const cancelUsernameButton = document.getElementById(
      "reset-username-button"
    );
    const editPasswordButton = document.getElementById("edit-password-button");
    const savePasswordButton = document.getElementById("save-password-button");
    const cancelPasswordButton = document.getElementById(
      "reset-password-button"
    );
    const logoutButton = document.getElementById("logout-button");

    const fieldsArray = [
      nameField,
      lastNameField,
      emailField,
      phoneField,
      tagField,
    ];

    passwordField.value = "qwerty12345";

    const toggleEditMode = (
      fieldsArray,
      editButton,
      saveButton,
      cancelButton
    ) => {
      fieldsArray.forEach(function (element) {
        element.disabled = !element.disabled;
      });

      editButton.style.display = fieldsArray[0].disabled
        ? "inline-block"
        : "none";
      saveButton.style.display = fieldsArray[0].disabled
        ? "none"
        : "inline-block";
      cancelButton.style.display = fieldsArray[0].disabled
        ? "none"
        : "inline-block";
    };

    editButton.addEventListener(
      "click",
      toggleEditMode.bind(
        null,
        fieldsArray,
        editButton,
        saveButton,
        cancelButton
      )
    );

    saveButton.addEventListener("click", (e) => {
      e.preventDefault();
      toggleEditMode(fieldsArray, editButton, saveButton, cancelButton);
    });

    cancelButton.addEventListener("click", () => {
      toggleEditMode(fieldsArray, editButton, saveButton, cancelButton);
    });

    editUsernameButton.addEventListener(
      "click",
      toggleEditMode.bind(
        null,
        [usernameField],
        editUsernameButton,
        saveUsernameButton,
        cancelUsernameButton
      )
    );

    saveUsernameButton.addEventListener("click", (e) => {
      e.preventDefault();
      toggleEditMode(
        [usernameField],
        editUsernameButton,
        saveUsernameButton,
        cancelUsernameButton
      );
    });

    cancelUsernameButton.addEventListener("click", () => {
      toggleEditMode(
        [usernameField],
        editUsernameButton,
        saveUsernameButton,
        cancelUsernameButton
      );
    });

    editPasswordButton.addEventListener(
      "click",
      toggleEditMode.bind(
        null,
        [passwordField],
        editPasswordButton,
        savePasswordButton,
        cancelPasswordButton
      )
    );

    savePasswordButton.addEventListener("click", (e) => {
      e.preventDefault();
      toggleEditMode(
        [passwordField],
        editPasswordButton,
        savePasswordButton,
        cancelPasswordButton
      );
    });

    cancelPasswordButton.addEventListener("click", () => {
      toggleEditMode(
        [passwordField],
        editPasswordButton,
        savePasswordButton,
        cancelPasswordButton
      );
    });

    // logoutButton.addEventListener("click", () => {
    //   isLoggedIn.status = false;
    //   document.querySelector("nav").remove();
    //   replaceHistoryAndGoTo("/Login");
    // });
  }
}
