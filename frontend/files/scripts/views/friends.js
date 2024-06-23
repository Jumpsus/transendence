import { Component } from "../library/component.js";
import { myUsername, host } from "../../index.js";

export class Friends extends Component {
  constructor() {
    super(document.getElementById("profile-wrapper"));
    this.view = `
	<div class="w-100">
		<div class="d-flex justify-content-between align-items-center">
			<h4 class="" id="friend-count"></h4>
			<form>
				<input type="text" class="form-control rounded-0" placeholder="Find a friend" style="max-width: 200px;" id="find-friend">
				</input>
			</form>
		</div>
		<div class="d-flex flex-wrap mt-3 gap-3" id="friends-list">
		</div>
		<div class="d-flex flex-wrap mt-3 gap-3" id="search-list">
		</div>
	</div>
		`;
    this.render();
    this.setupEventListeners();
  }

  async render() {
    super.render();
    const friendsList = document.getElementById("friends-list");
    await fetch(`https://${host}/user-management/user/userlist`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
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
					<a href="/${
            friend.username
          }" data-link><div class="profile-img-box position-relative rounded-0" style="width: 100px; height:100px;">
						<img src="https://${host}/image/${
            friend.username
          }.png?t=${new Date().getTime()}" class="position-absolute object-fit-cover  profile-img rounded-0"
								alt="...">
					</div></a>
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
      await fetch(`https://${host}/user-management/user/userlist`, {
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
          searchList.innerHTML = "";
          if (findFriend.value == "") {
            friendsList.classList.remove("d-none");
            friendsList.classList.add("d-flex");
            return;
          }
          data.user_list.forEach((friend) => {
            if (
              friend.username.startsWith(findFriend.value.toLowerCase()) &&
              friend.username != myUsername.username
            ) {
              searchList.innerHTML += `<div>
				<a href="/${
          friend.username
        }" data-link><div class="profile-img-box position-relative rounded-0" style="width: 100px; height:100px;">
				<img src="https://${host}/image/${
                friend.username
              }.png?t=${new Date().getTime()}" class="position-absolute object-fit-cover  profile-img rounded-0"
						alt="...">
			</div></a>
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
