import { Component } from "../library/component.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";
import { isLoggedIn } from "../../index.js";

export class Profile extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<div><img src="assets/profile.png" class="rounded-circle" style="width: 150px; height: 150px; object-fit: cover;" alt="">
		</div>
		<form action="" method="" id="profile-form">
			<div class="row mb-3 d-flex align align-items-center">
				<label class="col-2" for="profile-username">Username</label>
				<div class="col-4 p-0">
					<div class="input-group">
						<span class="input-group-text rounded-start-pill">@</span>
						<input class="form-control rounded-end-pill" type="text" id="profile-username" name="username"
							disabled>
					</div>
				</div>
			</div>
			<div class="row mb-3 d-flex align align-items-center">
				<label class="col-2" for="profile-nickname">Nickname</label>
				<div class="col-4 p-0"><input class="form-control rounded-pill ps-4" type="text" id="profile-nickname"
						name="nickname" disabled>
				</div>
			</div>
			<div class="row mb-3 d-flex align align-items-center">
				<label class="col-2" for="profile-password">Password</label>
				<div class="col-4 p-0"><input class="form-control rounded-pill ps-4" type="password" id="profile-password"
						name="password" disabled></div>
			</div>
			<button type="button" class="btn btn-outline-light rounded-pill" id="edit-button">Edit</button>
			<button type="submit" class="btn btn-primary rounded-pill" style="display: none;" id="save-button">Save</button>
			<button type="button" class="btn btn-secondary rounded-pill" style="display: none;"
				id="reset-button">Cancel</button>
		</form>
		<br>
		<button type="button" class="btn btn-outline-danger rounded-pill" id="logout-button">Log out</button>
	`;
    this.render();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Get references to the necessary elements
    const usernameField = document.getElementById("profile-username");
    const passwordField = document.getElementById("profile-password");
    const nicknameField = document.getElementById("profile-nickname");
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");
    const cancelButton = document.getElementById("reset-button");
	const logoutButton = document.getElementById("logout-button");

    const fieldsArray = [usernameField, passwordField, nicknameField];

    // Simulating fetching username from the backend
    const fetchDataFromBackend = () => {
      const data = {
        username: "example_username",
        password: "example_password",
        nickname: "example_nickname",
      };
      return data;
    };

    // Function to set the initial value of the username field
    const setUserData = () => {
      const data = fetchDataFromBackend();
      usernameField.value = data.username;
      passwordField.value = data.password;
      nicknameField.value = data.nickname;
    };

    // Call the function to set initial username
    setUserData();

    // Function to toggle between edit and view modes
    const toggleEditMode = () => {
      // Toggle the disabled attribute of the username field

      // Toggle the visibility of buttons
      fieldsArray.forEach(function (element) {
        element.disabled = !element.disabled;
      });

      editButton.style.display = usernameField.disabled
        ? "inline-block"
        : "none";
      saveButton.style.display = usernameField.disabled
        ? "none"
        : "inline-block";
      cancelButton.style.display = usernameField.disabled
        ? "none"
        : "inline-block";
    };

    // Event listener for the edit button
    editButton.addEventListener("click", toggleEditMode);

    // Event listener for the save button
    saveButton.addEventListener("click", () => {
      // Save the updated username (here you can add your logic to save the username)
      // For demonstration, let's just log it to the console
      console.log("Updated username:", usernameField.value);

      // Toggle back to view mode
      toggleEditMode();
    });

    cancelButton.addEventListener("click", () => {
      setUserData();
      toggleEditMode();
    });

	logoutButton.addEventListener("click", () => {
		isLoggedIn.status = false;
		document.querySelector("nav").remove();
		replaceHistoryAndGoTo("/Login");
	});


  }
}
