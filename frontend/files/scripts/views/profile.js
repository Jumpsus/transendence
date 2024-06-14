import { Component } from "../library/component.js";
import { makeLinkActive } from "../utils/other.js";
import { username, newUserView } from "../utils/router.js";
import { myUsername } from "../../index.js";
import { MatchHistory } from "./history.js";
import { compressImage } from "../utils/compress.js";

export class Profile extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<div class="container-lg d-flex flex-md-row flex-column align-items-md-end pt-4 pb-3 position-relative" id="profileHeader">
		<a href="/" id="back-button" class="position-absolute top-0 end-0 me-3 mt-3	text-decoration-none">home</a>
			<div class="d-flex flex-column align-items-center">
				<div class="profile-img-box position-relative" id="profile-img-box" style="width: 200px; height: 200px;">
					<div id="change-pic-svg">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="60" height="60"><g><path d="m14.287500000000001 10.290000000000001 0 1.1400000000000001 1.1400000000000001 0 0 4.574999999999999 1.1400000000000001 0 0 -4.574999999999999 5.715 0 0 6.855 1.1475 0 0 -12.57 -1.1475 0 0 4.574999999999999 -7.995 0z"  stroke-width="1"></path><path d="M21.142500000000002 18.285h1.1400000000000001v1.1475h-1.1400000000000001Z"  stroke-width="1"></path><path d="M21.142500000000002 4.574999999999999h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M20.0025 6.862500000000001h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M2.8575 19.4325h18.285v1.1400000000000001H2.8575Z"  stroke-width="1"></path><path d="M16.5675 8.0025h3.435v1.1400000000000001h-3.435Z"  stroke-width="1"></path><path d="M16.5675 5.715h3.435v1.1475h-3.435Z"  stroke-width="1"></path><path d="M15.4275 6.862500000000001h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M14.287500000000001 16.005h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M13.14 3.4275h8.0025V4.574999999999999H13.14Z"  stroke-width="1"></path><path d="m10.86 16.005 2.2800000000000002 0 0 -1.1475 1.1475 0 0 -2.2874999999999996 -1.1475 0 0 1.1475 -1.1400000000000001 0 0 -1.1475 1.1400000000000001 0 0 -1.1400000000000001 -2.2800000000000002 0 0 1.1400000000000001 -1.1475 0 0 2.2874999999999996 1.1475 0 0 1.1475z"  stroke-width="1"></path><path d="M9.712499999999999 9.1425h4.574999999999999v1.1475h-4.574999999999999Z"  stroke-width="1"></path><path d="M9.712499999999999 17.145h4.574999999999999v1.1400000000000001h-4.574999999999999Z"  stroke-width="1"></path><path d="M12 4.574999999999999h1.1400000000000001v1.1400000000000001H12Z"  stroke-width="1"></path><path d="M8.5725 16.005h1.1400000000000001v1.1400000000000001h-1.1400000000000001Z"  stroke-width="1"></path><path d="M6.285 3.4275h3.4275V4.574999999999999H6.285Z"  stroke-width="1"></path><path d="M3.9975 8.0025h2.2874999999999996v1.1400000000000001H3.9975Z"  stroke-width="1"></path><path d="m12 6.862500000000001 0 -1.1475 -1.1400000000000001 0 0 -1.1400000000000001 -1.1475 0 0 1.1400000000000001 -3.4275 0 0 -1.1400000000000001 -1.1400000000000001 0 0 1.1400000000000001 -2.2874999999999996 0 0 1.1475 9.1425 0z"  stroke-width="1"></path><path d="M1.71 18.285h1.1475v1.1475H1.71Z"  stroke-width="1"></path><path d="M1.71 6.862500000000001h1.1475v1.1400000000000001H1.71Z"  stroke-width="1"></path><path d="m1.71 11.43 5.715 0 0 4.574999999999999 1.1475 0 0 -4.574999999999999 1.1400000000000001 0 0 -1.1400000000000001 -8.0025 0 0 -2.2874999999999996 -1.1400000000000001 0 0 10.2825 1.1400000000000001 0 0 -6.855z"  stroke-width="1"></path></g></svg>
					</div>
					<img src="http://${location.hostname}/image/${
      username.username
    }.png?t=${new Date().getTime()}" class="position-absolute object-fit-cover profile-img" id="profile-img" alt="">
				</div>
				<div class="container d-flex mt-2 mx-0 px-0 justify-content-between gap-2 d-none" style="max-width:280px" id="profile-interaction">
					<button class="col btn btn-secondary rounded-0" id="message-button">Text</button>
					<button class="col btn btn-outline-secondary rounded-0" id="friend-button"></button>
				</div>
			</div>
			<div class="w-100 ms-md-3 h-100 d-flex flex-column justify-content-end">
				<div
					class="d-flex flex-wrap flex-md-row flex-column align-items-md-end align-items-center justify-content-between">
						<div class="fs-3">${username.username}</div>
					<div class="d-flex my-md-0 my-0 gap-1 fs-1 container m-0 p-0 justify-content-center" style="max-width: 300px">
							<div class="col-4 d-flex flex-column align-items-center">
								<div class="fs-6 text-secondary">Wins</div>
								<div class="" id="wonNumber"></div>
							</div>
							<div class="col-4 d-flex flex-column align-items-center">
								<div class="fs-6 text-secondary">Ratio</div>
								<div class="" id="winRate">65%</div>
							</div>
							<div class="col-4 d-flex flex-column align-items-center">
								<div class="fs-6 text-secondary">Losses</div>
								<div class="" id="lostNumber"></div>
							</div>
					</div>
				</div>
			</div>
		</div>
		<ul class="nav d-flex justify-content-center py-3" id="profileMenu">
			<li class="nav-item" id="friendsTab">
				<a href="/${username.username}/Friends" class="nav-link" aria-current="page"
					data-link>Friends</a>
			</li>
			<li class="nav-item">
				<a href="/${username.username}" class="nav-link" data-link>History</a>
			</li>
			<li class="nav-item" id="settingsTab">
				<a href="/${username.username}/Settings" class="nav-link" data-link>Settings</a>
			</li>
		</ul>
		<div class="d-flex justify-content-center" style="" id="profile-wrapper">
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
      `http://${location.hostname}:8000/user/getotherinfo`,
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
            `http://${location.hostname}:8000/user/uploadimage`,
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
        await fetch(`http://${location.hostname}:8000/user/makerelation`, {
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
