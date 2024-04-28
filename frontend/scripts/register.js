import { signUpHandler } from "./login.js";

export function signInHandler() {
  const loginLink = document.getElementById("signInLink");

  loginLink.addEventListener("click", async function (event) {
    event.preventDefault();
    const response = await fetch("views/login.html");
    const html = await response.text();
    document.body.innerHTML = html;
    document.title = "Log In";
    signUpHandler();
    history.pushState({}, "", "/Login");
  });
}
