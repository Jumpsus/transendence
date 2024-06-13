import { setupDarkMode } from "./scripts/utils/darkmode.js";
import {
  pushHistoryAndGoTo,
  replaceHistoryAndGoTo,
  goTo,
} from "./scripts/utils/router.js";

export let isLoggedIn = { status: false };

export const myUsername = { username: "" };

document.addEventListener("keypress", (event) => {
  if (event.key === "F" || event.key === "f") {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    } else {
      document.exitFullscreen();
    }
  }
});

window.addEventListener("popstate", () => {
  const url = window.location.pathname;
  if (isLoggedIn.status && (url === "/Login" || url === "/Register")) {
    replaceHistoryAndGoTo("/");
  } else if (!isLoggedIn.status && url != "/Login" && url != "/Register") {
    replaceHistoryAndGoTo("/Login");
  } else goTo(url);
});

export async function setMyUsername() {
  if (localStorage.getItem("jwt") === null) return false;
  const resp = await fetch(`http://${location.hostname}:8000/user/getinfo`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  const data = await resp.json();
  //   console.log(data);
  if (data.username === undefined) return false;
  myUsername.username = data.username;
  return true;
}

document.addEventListener("DOMContentLoaded", async () => {
  isLoggedIn.status = await setMyUsername();
  setupDarkMode();
  setupNavigation();
  replaceHistoryAndGoTo(window.location.pathname);
});

function setupNavigation() {
  document.body.addEventListener("click", (event) => {
    const targetElement = event.target.closest("[data-link]");

    if (targetElement) {
      event.preventDefault();
      pushHistoryAndGoTo(targetElement.getAttribute("href"));
    }
  });
}
