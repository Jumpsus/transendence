import { Home } from "../views/home.js";
import { Login } from "../views/login.js";
import { Profile } from "../views/profile.js";
import { Tournament } from "../views/tournament.js";
import { Register } from "../views/register.js";
import { MatchHistory } from "../views/history.js";
import { Settings } from "../views/settings.js";
import { Friends } from "../views/friends.js";

const routes = [
  { path: "/", view: Home },
  { path: "/Login", view: Login },
  { path: "/Register", view: Register },
  { path: "/Profile", view: Profile },
  { path: "/Friends", view: Friends},
  { path: "/Tournament", view: Tournament },
  { path: "/History", view: MatchHistory },
  { path: "/Settings", view: Settings },
];

function router() {
  const url = window.location.pathname;
  const route = routes.find((route) => route.path === url);
  const view = new route.view();
}

function pushHistoryAndGoTo(path) {
  history.pushState({}, "", path);
  router();
}

function replaceHistoryAndGoTo(path) {
  history.replaceState({}, "", path);
  router();
}

export { pushHistoryAndGoTo, replaceHistoryAndGoTo, router };
