import { setupDarkMode } from "./scripts/utils/darkmode.js";
import {
  pushHistoryAndGoTo,
  replaceHistoryAndGoTo,
  router,
} from "./scripts/utils/router.js";
import { Nav } from "./scripts/views/nav.js";

async function checkLoginStatus() {
  return true; // do API magic to check if the user is logged in
}

window.addEventListener("popstate", () => {
  const url = window.location.pathname;
  if (isLoggedIn.status && (url === "/Login" || url === "/Register")) {
    replaceHistoryAndGoTo("/");
  } else if (!isLoggedIn.status && url != "/Login" && url != "/Register") {
    replaceHistoryAndGoTo("/Login");
  } else router();
});

export let isLoggedIn = { status: false };

document.addEventListener("DOMContentLoaded", async () => {
  setupDarkMode();
  setupNavigation();
  isLoggedIn.status = await checkLoginStatus();
  if (!isLoggedIn.status) {
    replaceHistoryAndGoTo("/Login");
  } else {
    const navbar = new Nav();
    replaceHistoryAndGoTo("/");
  }
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

window.addEventListener("load", function () {
  console.log("All resources have finished loading");
});
