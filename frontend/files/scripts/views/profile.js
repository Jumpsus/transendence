import { Component } from "../library/component.js";
import { Friends } from "./friends.js";
import { makeLinkActive } from "../utils/other.js";
import { username } from "../utils/router.js";

export class Profile extends Component {
  constructor() {
    super(document.getElementById("content-wrapper"));
    this.view = `
		<div class="bg-body-tertiary rounded-5 d-flex flex-md-row flex-column" id="profileHeader">
			<div class="align-self-center">
				<img src="/assets/profile.png" class="rounded-5 my-3 m-md-3" width="200" height="200" alt="">
			</div>
			<div class="w-100 p-md-3 pb-3 px-3 h-100 align-self-end d-flex flex-column">
				<div
					class="mb-2 d-flex flex-wrap flex-md-row flex-column align-items-md-end align-items-center justify-content-between">
					<div class="fs-3">@${username.username}</div>
					<div class="d-flex gap-1 my-md-0 my-2">
						<div class="fs-3 border border-1 rounded-3 d-flex align-items-center p-2 gap-2">
							<div>Lvl</div>
							<div id="lvl"></div>
						</div>
						<div class="fs-3 border border-1 rounded-3 d-flex p-2 gap-2">
							<div>👍</div>
							<div class="d-flex flex-column">
								<div class="fs-6 text-secondary">Wins</div>
								<div class="text-success" id="wonNumber"></div>
							</div>
						</div>
						<div class="fs-3 border border-1 rounded-3 d-flex p-2 gap-2">
							<div>👎</div>
							<div class="d-flex flex-column">
								<div class="fs-6 text-secondary">Losses</div>
								<div class="text-danger" id="lostNumber"></div>
							</div>
						</div>
					</div>
				</div>
				<div class="progress" role="progressbar" aria-label="Warning example with label" aria-valuenow="75"
					aria-valuemin="0" aria-valuemax="100">
					<div class="progress-bar text-bg-dark w-75">75%</div>
				</div>
			</div>
		</div>
		<ul class="nav nav-pills d-flex justify-content-center py-3" id="profileMenu">
			<li class="nav-item">
				<a href="/${username.username}/Friends" class="nav-link active bg-body-tertiary text-body" aria-current="page"
					data-link>Friends</a>
			</li>
			<li class="nav-item">
				<a href="/${username.username}/History" class="nav-link text-body-tertiary" data-link>Match History</a>
			</li>
			<li class="nav-item">
				<a href="/${username.username}/Settings" class="nav-link text-body-tertiary" data-link>Settings</a>
			</li>
		</ul>
		<div class="bg-body-tertiary rounded-5 px-5 py-4" id="profile-wrapper">
		</div>
	`;
    this.render();
    this.setupEventListeners();
  }

  render() {
    if (!document.getElementById("profileMenu")) super.render();
    new Friends();
    const wonNumber = document.getElementById("wonNumber");
    const lostNumber = document.getElementById("lostNumber");
	const lvl = document.getElementById("lvl");
    fetch(`https://${location.host}:9000/user/getinfo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
		lvl.textContent = data.level;
        wonNumber.textContent = data.win;
        lostNumber.textContent = data.lose;
      })
      .catch((error) => {
        console.log(error);
      });

    makeLinkActive(document.getElementById("profileMenu"));
  }
}
