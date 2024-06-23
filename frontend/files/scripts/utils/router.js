import { Home } from "../views/home.js";
import { Login } from "../views/login.js";
import { Profile } from "../views/profile.js";
import { Tournament } from "../views/tournament.js";
import { Register } from "../views/register.js";
import { Info } from "../views/info.js";
import { Friends } from "../views/friends.js";
import { isLoggedIn, myUsername, host } from "../../index.js";
import { NotExist } from "../views/404.js";
import { Game } from "../views/gameview.js";
import { arrayFromMultiPath } from "./other.js";
import { Options } from "../views/options.js";
import { ModeSelect } from "../views/modeSelect.js";
import { MatchRoom } from "../views/matchRoom.js";
import { gameConfig } from "../game/setup.js";

export let username = { username: "" };
let lastViewedUser = "";
export let newUserView = false;

const routes = [
  { path: "/", view: Home },
  { path: "/Tournament", view: Tournament },
  { path: "/Friends", view: Friends },
  { path: "/Info", view: Info },
  { path: "/Game", view: Game },
  { path: "/Select", view: ModeSelect },
  { path: "/Options", view: Options },
  { path: "/MatchRoom", view: MatchRoom },
];

const routesLoggedOut = [
  { path: "/Login", view: Login },
  { path: "/Register", view: Register },
];

function getCorrectUrl(url) {
  let route;
  if (isLoggedIn.status) {
	if (url === "/Game" && !gameConfig.key)
		url = "/Select";
    if (routesLoggedOut.find((route) => route.path === url))
      return myUsername.username;
    else {
      if (url != "/" && url[url.length - 1] === "/") url = url.slice(0, -1);
      return url;
    }
  } else {
    route = routesLoggedOut.find((route) => route.path === url);
    if (!route) return routesLoggedOut[0].path;
    return route.path;
  }
}

async function userExists(username) {
  const resp = await fetch(`https://${host}/user-management/user/userlist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("jwt")}`,
    },
  });
  const data = await resp.json();
  const userExists = data.user_list.some((user) => user.username === username);
  return userExists;
}

async function pathToView(url) {
  let route;
  let viewArr = [];
  if (isLoggedIn.status) {
    let parts = arrayFromMultiPath(url);
    for (let i = 0; i < parts.length; i++) {
      route = routes.find((route) => route.path === parts[i]);
      if (i == 0 && !route) {
        if (!(await userExists(parts[0].replace("/", "")))) {
          viewArr = [NotExist];
          break;
        } else {
          username.username = parts[i].replace("/", "");
          if (myUsername.username != username.username && parts.length > 1) {
            viewArr = [NotExist];
            break;
          }
          if (lastViewedUser != username.username) {
            newUserView = true;
            lastViewedUser = username.username;
          } else newUserView = false;
          viewArr.push(Profile);
          continue;
        }
      }
      if (i > 0 && !route) {
        viewArr = [NotExist];
        break;
      }
      viewArr.push(route.view);
    }
  } else {
    route = routesLoggedOut.find((route) => route.path === url);
    if (document.getElementById("homeNav"))
      document.getElementById("homeNav").remove();
    viewArr.push(route.view);
  }
  viewArr.forEach((view) => {
    renderView(view);
  });
}

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
