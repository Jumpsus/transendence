import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { isLoggedIn } from "../../index.js";
import { replaceHistoryAndGoTo } from "../utils/router.js";

export class Settings extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
		<div class="container m-0 p-0 settings-cont">
			<div class="col">
				<h4 class="mb-4">Personal information</h4>
				<form class="row g-3">
					<div class="col-sm-6">
						<label for="personal-name" class="form-label">First Name</label>
						<input type="text" class="form-control  rounded-0" id="personal-name" disabled>
					</div>
					<div class="col-sm-6">
						<label for="personal-lastname" class="form-label">Last name</label>
						<input type="text" class="form-control  rounded-0" id="personal-lastname"
							disabled>
					</div>
					<div class="col-sm-6">
						<label for="personal-phone" class="form-label">Tel</label>
						<input type="tel" class="form-control rounded-0" id="personal-phone"
							disabled>
					</div>
					<div class="col-sm-6">
						<label for="personal-tag" class="form-label">Tag</label>
						<div>
							<div class="input-group">
								<input class="form-control  rounded-0" type="text" id="personal-tag" name="username"
									disabled>
							</div>
						</div>
					</div>
					<div class="d-flex justify-content-end">
						<button type="button" class="btn btn-secondary rounded-0" id="edit-button">Edit</button>
						<button type="submit" class="btn btn-primary me-2 rounded-0" style="display: none;"
							id="save-button">Save</button>
						<button type="button" class="btn btn-secondary rounded-0" style="display: none;"
							id="reset-button">Cancel</button>
					</div>
				</form>
			</div>
			<hr class="my-4">
			<div class="col">
				<h4 class="mb-4">Account information</h4>
					<form class="row g-3">
						<div class="col-sm-6">
							<label for="profile-username" class="form-label">Username</label>
							<input type="text" class="form-control  rounded-0" id="profile-username" autocomplete="username"
								disabled>
						</div>
						<div class="col-sm-6">
							<div id="old-password-div">
								<label for="profile-password" class="form-label" >Password</label>
								<input type="password" class="form-control  rounded-0" id="profile-password" autocomplete="old-password" disabled>
							</div>
							<div class="mt-3 d-none" id="new-password-div">
								<label for="new-profile-password" class="form-label" >New password</label>
								<input type="password" class="form-control  rounded-0" autocomplete="new-password" id="new-profile-password">
							</div>
							<div class="mt-3 d-none" id="new-password-2-div">
								<label for="new-profile-password-2" class="form-label">Confirm new password</label>
								<input type="password" class="form-control  rounded-0" autocomplete="new-password" id="new-profile-password-2">
							</div>
							<div class="text-danger" id="password-error"></div>
							<div class="d-flex justify-content-end mt-3">
								<button type="button" class="btn btn-secondary rounded-0" id="edit-password-button">Edit</button>
								<button type="submit" class="btn btn-primary me-2 rounded-0" style="display: none;"
									id="save-password-button">Save</button>
								<button type="button" class="btn btn-secondary rounded-0" style="display: none;"
									id="reset-password-button">Cancel</button>
							</div>
						</div>
					</form>
			</div>
			<hr class="my-4">
			<div class="d-flex justify-content-end mb-4">
				<button type="button" class="btn btn-outline-danger rounded-0" id="logout-button">Log
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

  async setupEventListeners() {
    const usernameField = document.getElementById("profile-username");
    const passwordField = document.getElementById("profile-password");
    const nameField = document.getElementById("personal-name");
    const lastNameField = document.getElementById("personal-lastname");
    const phoneField = document.getElementById("personal-phone");
    const tagField = document.getElementById("personal-tag");
    const editButton = document.getElementById("edit-button");
    const saveButton = document.getElementById("save-button");
    const cancelButton = document.getElementById("reset-button");
    const editPasswordButton = document.getElementById("edit-password-button");
    const savePasswordButton = document.getElementById("save-password-button");
    const cancelPasswordButton = document.getElementById(
      "reset-password-button"
    );
    const logoutButton = document.getElementById("logout-button");
    const oldPassDiv = document.getElementById("old-password-div");
    let newPassDiv = document.getElementById("new-password-div");
    let newPass2Div = document.getElementById("new-password-2-div");
    const passwordErrorMsg = document.getElementById("password-error");

    const fieldsArray = [nameField, lastNameField, phoneField, tagField];

    await fetch(`https://${location.hostname}/user-management/user/getinfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        nameField.value = data.name;
        lastNameField.value = data.last_name;
        phoneField.value = data.phone_number;
        tagField.value = data.tag;
        usernameField.value = data.username;
      })
      .catch((error) => {
        console.log("we got an error: ", error);
      });

    const toggleEditMode = (
      fieldsArray,
      editButton,
      saveButton,
      cancelButton,
      isPassword = false
    ) => {
      if (isPassword) {
        if (newPassDiv.classList.contains("d-none")) {
          newPassDiv.classList.remove("d-none");
          newPass2Div.classList.remove("d-none");
          oldPassDiv.querySelector("label").innerText = "Old password";
        } else {
          newPassDiv.classList.add("d-none");
          newPass2Div.classList.add("d-none");
          oldPassDiv.querySelector("label").innerText = "Password";
        }
      }
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
        cancelButton,
        false
      )
    );

    saveButton.addEventListener("click", async (e) => {
      e.preventDefault();
      toggleEditMode(fieldsArray, editButton, saveButton, cancelButton);
      await fetch(`https://${location.hostname}/user-management/user/updateinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({
          name: nameField.value,
          last_name: lastNameField.value,
          phone_number: phoneField.value,
          tag: tagField.value,
        }),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("we have data: ", data);
        })
        .catch((error) => {
          console.log("we got an error: ", error);
        });
    });

    cancelButton.addEventListener("click", () => {
      toggleEditMode(fieldsArray, editButton, saveButton, cancelButton, false);
    });

    editPasswordButton.addEventListener(
      "click",
      toggleEditMode.bind(
        null,
        [passwordField],
        editPasswordButton,
        savePasswordButton,
        cancelPasswordButton,
        true
      )
    );

    savePasswordButton.addEventListener("click", async (e) => {
      e.preventDefault();
      if (
        newPassDiv.querySelector("input").value !==
        newPass2Div.querySelector("input").value
      ) {
        passwordErrorMsg.innerText = "Passwords do not match";
        return;
      } else {
        await fetch(`https://${location.hostname}/user-management/user/changepassword`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({
            old_password: passwordField.value,
            password: newPassDiv.querySelector("input").value,
          }),
        })
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            if (data.code != "00") {
              passwordErrorMsg.classList.add("text-danger");
              passwordErrorMsg.classList.remove("text-success");
              passwordErrorMsg.innerText = data.message;
              return;
            }
            passwordErrorMsg.innerText = "Password updated";
            passwordErrorMsg.classList.remove("text-danger");
            passwordErrorMsg.classList.add("text-success");
            toggleEditMode(
              [passwordField],
              editPasswordButton,
              savePasswordButton,
              cancelPasswordButton,
              true
            );
          })
          .catch((error) => {
            passwordErrorMsg.innerText = "Error reaching the server";
          });
      }
    });

    cancelPasswordButton.addEventListener("click", () => {
      passwordErrorMsg.innerText = "";
      toggleEditMode(
        [passwordField],
        editPasswordButton,
        savePasswordButton,
        cancelPasswordButton,
        true
      );
    });

    logoutButton.addEventListener("click", async () => {
      await fetch(`https://${location.hostname}/user-management/user/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          localStorage.removeItem("jwt");
          isLoggedIn.status = false;
          document.querySelector("nav").innerHTML = "";
          replaceHistoryAndGoTo("/Login");
        })
        .catch((error) => {
          console.log("we got an error: ", error);
        });
    });
  }
}
