import { Component } from "../library/component.js";
import { NotExist } from "./404.js";
import { myUsername } from "../../index.js";

export class Friends extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
	<div class="d-flex justify-content-between">
				<div class="fs-3" id="friend-count"></div>
				<form action="">
					<input type="text" class="form-control rounded-pill" placeholder="Find a friend" id="find-friend">
					</input>
				</form>
			</div>
			<div class="d-flex flex-wrap mt-3 gap-3" id="friends-list">
			</div>
			<div class="d-flex flex-wrap mt-3 gap-3" id="search-list">
			</div>
		`;
    this.render();
    this.setupEventListeners();
  }

  async render() {
    if (
      myUsername.username != location.pathname.split("/")[1] &&
      location.pathname.split("/")[1] != ""
    )
      new NotExist();
    else super.render();
    const friendsList = document.getElementById("friends-list");
    await fetch(`https://${location.host}:9000/user/userlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ type: "friend" }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        document.getElementById(
          "friend-count"
        ).textContent = `${data.user_list.length} Friends`;
        data.user_list.forEach((friend) => {
          friendsList.innerHTML += `<div>
					<a href="/${friend.username}/History" data-link><img src="/assets/profile.png" class="rounded-circle border border-4 border-success"
							width="100" height="100" alt="..."></a>
					<div class="d-flex justify-content-center">
						<div>${friend.username}</div>
					</div>
				</div>`;
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  setupEventListeners() {
    const findFriend = document.getElementById("find-friend");
    findFriend.addEventListener("input", async () => {
      const friendsList = document.getElementById("friends-list");
      const searchList = document.getElementById("search-list");
      friendsList.classList.add("d-none");
      friendsList.classList.remove("d-flex");
      await fetch(`https://${location.host}:9000/user/userlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          searchList.innerHTML = "";
          if (findFriend.value == "") {
            friendsList.classList.remove("d-none");
            friendsList.classList.add("d-flex");
            return;
          }
          data.user_list.forEach((friend) => {
            if (
              friend.username.startsWith(findFriend.value) &&
              friend.username != myUsername.username
            ) {
              searchList.innerHTML += `<div>
				<a href="/${friend.username}/History" data-link><img src="/assets/profile.png" class="rounded-circle border border-4 border-success"
						width="100" height="100" alt="..."></a>
				<div class="d-flex justify-content-center">
					<div>${friend.username}</div>
				</div>
			</div>`;
            }
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  }
}
