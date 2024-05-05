import { Home } from "../views/home.js";
import { Login } from "../views/login.js";
import { Profile } from "../views/profile.js";
import { Tournament } from "../views/tournament.js";
import { Register } from "../views/register.js";

const routes = [
  { path: "/", view: Home },
  { path: "/Login", view: Login },
  { path: "/Register", view: Register },
  { path: "/Profile", view: Profile },
  { path: "/Tournament", view: Tournament },
];

function router() {
  const url = window.location.pathname;
//   console.log(url);
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
