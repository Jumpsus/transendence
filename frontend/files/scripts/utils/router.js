import { Home } from "../views/home.js";
import { Login } from "../views/login.js";
import { Profile } from "../views/profile.js";
import { Tournament } from "../views/tournament.js";
import { Register } from "../views/register.js";
import { MatchHistory } from "../views/history.js";
import { Settings } from "../views/settings.js";
import { Friends } from "../views/friends.js";
import { isLoggedIn } from "../../index.js";
import { Nav } from "../views/nav.js";
import { NotExist } from "../views/404.js";
import { myUsername } from "../../index.js";

export let username = { username: "" };

const routes = [
  { path: "/", view: Home },
  { path: "/Tournament", view: Tournament },
  { path: "/Friends", view: Friends },
  { path: "/History", view: MatchHistory },
  { path: "/Settings", view: Settings },
];

const routesLoggedOut = [
  { path: "/Login", view: Login },
  { path: "/Register", view: Register },
];

const usernames = ["user1", "user2", "user3"];

// function checkIfProfileUrl(url) {
//   const parts = string.split("/");
//   if (parts.length != 2) return false;
//   const substring = parts.length > 1 ? parts[parts.length - 1] : "";
//   return routes.some((route) => route.path === `/${substring}`);
// }

function getCorrectUrl(url) {
  let route;
  if (isLoggedIn.status) {
    if (routesLoggedOut.find((route) => route.path === url))
      return myUsername.username;
    else return url;
  } else {
    route = routesLoggedOut.find((route) => route.path === url);
    if (!route) return routesLoggedOut[0].path;
    return route.path;
  }
}

function arrayFromMultiPath(url) {
  let parts = url.split("/").filter(Boolean);
  parts = parts.map((part) => "/" + part);
  if (parts.length == 0) parts = ["/"];
  return parts;
}

async function userExists(username) {
  return usernames.includes(username);
}

async function pathToView(url) {
  let route;
  if (isLoggedIn.status) {
    if (!document.getElementById("homeNav")) new Nav();
    let parts = arrayFromMultiPath(url);
    for (let i = 0; i < parts.length; i++) {
      route = routes.find((route) => route.path === parts[i]);
      if (i == 0 && !route) {
        if (
          parts.length == 1 ||
          !(await userExists(parts[i].replace("/", "")))
        ) {
          renderView(NotExist);
          return;
        } else {
          username.username = parts[i].replace("/", "");
          renderView(Profile);
          continue;
        }
      }
      renderView(route.view);
    }
  } else {
    route = routesLoggedOut.find((route) => route.path === url);
    if (!route) route = routesLoggedOut[0];
    if (document.getElementById("homeNav"))
      document.getElementById("homeNav").remove();
    renderView(route.view);
  }
}

// function router() {
//   const url = window.location.pathname;
//   const route = routes.find((route) => route.path === url);
//   const view = new route.view();
// }

function renderView(view) {
  new view();
}

function pushHistoryAndGoTo(url) {
  url = getCorrectUrl(url);
  history.pushState({}, "", url);
  pathToView(url);
}

function replaceHistoryAndGoTo(url) {
  url = getCorrectUrl(url);
  history.replaceState({}, "", url);
  pathToView(url);
}

function goTo(url) {
  url = getCorrectUrl(url);
  pathToView(url);
}

export { pushHistoryAndGoTo, replaceHistoryAndGoTo, goTo };
