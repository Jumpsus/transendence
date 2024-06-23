import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { username, newUserView, replaceHistoryAndGoTo } from "../utils/router.js";
import { myUsername, host, isLoggedIn } from "../../index.js";
import { MatchHistory } from "./history.js";
import { compressImage } from "../utils/compress.js";

export class Profile extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div id="profile-window" class="d-flex flex-column py-4  px-sm-4 px-2 position-relative overflow-auto">
		<a id="back-button" class="position-absolute top-0 end-0 me-4 mt-4 fs-4" data-link></a>
		<div class="d-flex flex-sm-row flex-column mb-4" id="profileHeader">
			<div class="profile-img-box position-relative align-self-center" id="profile-img-box"
				style="width: 200px; height: 200px;">
				<img src="https://${host}/image/${
      username.username
    }.png?t=${new Date().getTime()}" class="position-absolute object-fit-cover profile-img"
					id="profile-img" alt="">
          <div class="online-light position-absolute d-none" id="profile-online"></div>
			</div>
			<div class="d-flex justify-content-between align-items-center align-items-sm-end flex-grow-1 ms-2">
				<div class="d-flex flex-column">
					<div class="d-flex gap-2">
						<div>w/l</div>
						<div><span id="wonNumber">35</span>/<span id="lostNumber">12</span></div>
					</div>
					<div>${username.username}</div>
				</div>
				<button class="my-button primary-button d-none" id="friend-button">add</button>
			</div>
		</div>
		<div class="d-flex justify-content-sm-start mb-2" id="profileMenu">
			<a href="/${username.username}" class="active" data-link>History</a>
			<a href="/${username.username}/Friends" id="friends-tab" data-link>Friends</a>
			<a href="/${
        username.username
      }/Info" class="ms-auto ms-sm-0" data-link id="settings-tab">Settings</a>
		</div>
		<div class="d-flex flex-grow-1 justify-content-center mt-3" id="profile-wrapper">
		</div>
	</div>
	`;
    this.render();
    this.setupEventListeners();
  }

  async render() {
    if (!document.getElementById("profileMenu") || newUserView) super.render();
    new MatchHistory();
    const backBtn = document.getElementById("back-button");
    if (myUsername.username != username.username) {
      document.getElementById("settings-tab").style.display = "none";
      document.getElementById("friends-tab").style.display = "none";
      document.getElementById("friend-button").classList.remove("d-none");
      backBtn.textContent = "<";
      backBtn.href = `/${myUsername.username}`;
    } else {
      backBtn.textContent = "x";
      backBtn.href = "/";
    }
    const wonNumber = document.getElementById("wonNumber");
    const lostNumber = document.getElementById("lostNumber");
    makeLinkActive(document.getElementById("profileMenu"), false);
    const onlineLight = document.getElementById("profile-online");
    const resp = await fetch(
      `https://${host}/user-management/user/getotherinfo`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
        body: JSON.stringify({ username: username.username }),
      }
    );
	if (!resp.ok) {
		if (resp.status == 401) {
		  localStorage.removeItem("jwt");
		  isLoggedIn.status = false;
		  replaceHistoryAndGoTo("/");
		}
		return;
	}
    const data = await resp.json();
    wonNumber.textContent = data.win;
    lostNumber.textContent = data.lose;
    let status = data.relation;
    if (username.username != myUsername.username) {
      if (data.status == "online") onlineLight.classList.remove("d-none");
    }
    const friendButton = document.getElementById("friend-button");
    const statusConfig = {
      pending: { text: "Pending", disabled: true },
      friend: { text: "Unfriend", disabled: false },
      add: { text: "Accept", disabled: false },
      default: { text: "Add", disabled: false },
    };
    const { text, disabled } = statusConfig[status] || statusConfig.default;
    friendButton.textContent = text;
    friendButton.disabled = disabled;
  }

  setupEventListeners() {
    const friendButton = document.getElementById("friend-button");
    const profileImgBox = document.getElementById("profile-img-box");
    const profileImg = document.getElementById("profile-img");
    if (myUsername.username == username.username) {
      profileImgBox.style.cursor = "pointer";
      profileImgBox.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();
        input.addEventListener("change", async () => {
          const file = await compressImage(input.files[0], {
            quality: 0,
            type: "image/jpeg",
          });
          const formData = new FormData();
          formData.append("image", file);
          const response = await fetch(
            `https://${host}/user-management/user/uploadimage`,
            {
              method: "POST",
              body: formData,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
              },
            }
          ).catch((error) => console.log(error));
          if (response.ok) {
            profileImg.src = URL.createObjectURL(file);
          }
        });
      });
    }
    if (friendButton) {
      friendButton.addEventListener("click", async () => {
        let action;
        let textContent;
        if (friendButton.textContent == "Unfriend") {
          action = "unfriend";
          textContent = "Add";
        } else if (friendButton.textContent == "Accept") {
          action = "accept";
          textContent = "Unfriend";
        } else if (friendButton.textContent == "Add") {
          action = "add";
          textContent = "Pending";
        } else return;
        await fetch(`https://${host}/user-management/user/makerelation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
          body: JSON.stringify({ username: username.username, action: action }),
        }).catch((error) => console.log(error));
        friendButton.textContent = textContent;
        if (textContent == "Pending") friendButton.disabled = true;
        else friendButton.disabled = false;
      });
    }
  }
}
