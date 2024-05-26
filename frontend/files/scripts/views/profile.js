import { Component } from "../library/component.js";
import { Friends } from "./friends.js";
import { makeLinkActive } from "../utils/other.js";
import { username, newUserView } from "../utils/router.js";
import { myUsername } from "../../index.js";
import { MatchHistory } from "./history.js";

export class Profile extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<div class="container-lg d-flex flex-md-row flex-column align-items-md-end pt-4 pb-3" id="profileHeader">
			<div class="d-flex flex-column align-items-center">
				<div class="profile-img-box position-relative rounded-1" style="width: 200px; height: 200px;"><img src="/assets/profile.png" class="position-absolute object-fit-cover profile-img rounded-1" alt=""></div>
				<div class="container d-flex mt-3 mx-0 px-0 justify-content-between gap-2 d-none" style="max-width:280px" id="profile-interaction">
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
				<a href="/${username.username}/History" class="nav-link" data-link>History</a>
			</li>
			<li class="nav-item" id="settingsTab">
				<a href="/${username.username}/Settings" class="nav-link" data-link>Settings</a>
			</li>
		</ul>
		<div class="container-lg py-4 flex-grow-1" style="" id="profile-wrapper">
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
      document.getElementById("profile-interaction").classList.remove("d-none");
    }
    const wonNumber = document.getElementById("wonNumber");
    const lostNumber = document.getElementById("lostNumber");
    fetch(`https://${location.host}:9000/user/getotherinfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username.username }),
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        wonNumber.textContent = data.win;
        lostNumber.textContent = data.lose;
        let status = data.relation;
        switch (status) {
          case "pending":
            document.getElementById("friend-button").textContent = "Pending";
            document.getElementById("friend-button").disabled = true;
            break;
          case "friend":
            document.getElementById("friend-button").textContent = "Unfriend";
            document.getElementById("friend-button").disabled = false;
            break;
          case "add":
            document.getElementById("friend-button").textContent = "Accept";
            document.getElementById("friend-button").disabled = false;
            break;
          default:
            document.getElementById("friend-button").textContent = "Add";
            document.getElementById("friend-button").disabled = false;
            break;
        }
      })
      .catch((error) => {
        console.log(error);
      });

    makeLinkActive(document.getElementById("profileMenu"));
  }

  setupEventListeners() {
    const messageButton = document.getElementById("message-button");
    const friendButton = document.getElementById("friend-button");
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
        await fetch(`https://${location.host}:9000/user/makerelation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ username: username.username, action: action }),
        })
          .then(() => {
            friendButton.textContent = textContent;
            if (textContent == "Pending") friendButton.disabled = true;
            else friendButton.disabled = false;
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }
}
