import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { username, newUserView } from "../utils/router.js";
import { myUsername, host } from "../../index.js";
import { MatchHistory } from "./history.js";
import { compressImage } from "../utils/compress.js";

export class Profile extends Component {
  constructor() {
    super(document.body);
    this.view = `
	<div id="profile-window" class="d-flex flex-column py-4 px-3 position-relative">
		<a href="/" id="back-button" class="position-absolute top-0 end-0 me-3 mt-4" data-link>x</a>
		<div class="d-flex flex-sm-row flex-column mb-4" id="profileHeader">
			<div class="profile-img-box position-relative align-self-center" id="profile-img-box"
				style="width: 200px; height: 200px;">
				<img src="https://${host}/image/${
      username.username
    }.png?t=${new Date().getTime()}" class="position-absolute object-fit-cover profile-img"
					id="profile-img" alt="">
			</div>
			<div class="d-flex justify-content-between align-items-end flex-grow-1 ms-2">
				<div class="d-flex flex-column">
					<div class="d-flex gap-2">
						<div class=" text-secondary">lvl</div>
						<div class="" id="winRate">0</div>
					</div>
					<div class="d-flex gap-2">
						<div class="text-secondary">Stats</div>
						<div class="" id="wonNumber">35/12</div>
					</div>
					<div>windowshopper95</div>
				</div>
				<button id="friend-button">add</button>
			</div>
		</div>
		<div class="d-flex justify-content-start gap-3 mb-2" id="profileMenu">
			<a href="/${
        username.username
      }/Friends" aria-current="page" data-link>Friends</a>
			<a href="/${username.username}" data-link>History</a>
			<a href="/${username.username}/Settings" class="ms-auto" data-link>Settings</a>
		</div>
		<div class="d-flex flex-grow-1" id="profile-wrapper">
		</div>
	</div>
	`;
    this.render();
    this.setupEventListeners();
  }

  async render() {
    if (!document.getElementById("profileMenu") || newUserView) super.render();
    new MatchHistory();
    if (myUsername.username != username.username) {
      document.getElementById("settingsTab").style.display = "none";
      document.getElementById("friendsTab").style.display = "none";
      document.getElementById("block-button").classList.remove("d-none");
      document.getElementById("profile-interaction").classList.remove("d-none");
    }
    const wonNumber = document.getElementById("wonNumber");
    const lostNumber = document.getElementById("lostNumber");
    const profileImg = document.getElementById("profile-img");
    let imgPath;
    makeLinkActive(document.getElementById("profileMenu"), false);
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
    const data = await resp.json();
    wonNumber.textContent = data.win;
    lostNumber.textContent = data.lose;
    let status = data.relation;
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
    const messageButton = document.getElementById("message-button");
    const friendButton = document.getElementById("friend-button");
    const changePicSvg = document.getElementById("change-pic-svg");
    const profileImgBox = document.getElementById("profile-img-box");
    const profileImg = document.getElementById("profile-img");
    const profileImgNav = document.getElementById("profile-img-nav");
    if (myUsername.username == username.username) {
      profileImgBox.style.cursor = "pointer";
      profileImgBox.addEventListener("mouseover", () => {
        changePicSvg.classList.add("appear");
      });
      profileImgBox.addEventListener("mouseout", () => {
        changePicSvg.classList.remove("appear");
      });
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
            profileImgNav.src = URL.createObjectURL(file);
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
