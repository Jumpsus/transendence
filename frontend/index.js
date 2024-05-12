import { setupDarkMode } from "./scripts/utils/darkmode.js";
import {
  pushHistoryAndGoTo,
  replaceHistoryAndGoTo,
  goTo,
} from "./scripts/utils/router.js";
import { Nav } from "./scripts/views/nav.js";

async function checkLoginStatus() {
  return true; // do API magic to check if the user is logged in
}

async function getUsername() {
  return "user2"; // do API magic to get the username
}

window.addEventListener("popstate", () => {
  const url = window.location.pathname;
  if (isLoggedIn.status && (url === "/Login" || url === "/Register")) {
    replaceHistoryAndGoTo("/");
  } else if (!isLoggedIn.status && url != "/Login" && url != "/Register") {
    replaceHistoryAndGoTo("/Login");
  } else goTo(url);
});

export let isLoggedIn = { status: false };
export let myUsername = { username: "" };

document.addEventListener("DOMContentLoaded", async () => {
  setupDarkMode();
  setupNavigation();
  isLoggedIn.status = await checkLoginStatus();
  if (isLoggedIn.status) {
    myUsername.username = await getUsername();
  }
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

// window.addEventListener("load", function () {
//   console.log("All resources have finished loading");
// });
