import { setupDarkMode } from "./scripts/utils/darkmode.js";
import {
  pushHistoryAndGoTo,
  replaceHistoryAndGoTo,
  goTo,
} from "./scripts/utils/router.js";

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

export async function getLoggedInStatus() {
  return await fetch(`https://${location.host}:9000/user/getinfo`, {
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
      if (data.username === undefined) {
        return false;
      } else {
        myUsername.username = data.username;
        return true;
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  isLoggedIn.status = await getLoggedInStatus();
  setupDarkMode();
  setupNavigation();
  //   console.log(isLoggedIn.status);
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
