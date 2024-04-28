import { signInHandler } from "./register.js";

export function signUpHandler() {
  const signUpLink = document.getElementById("signUpLink");

  signUpLink.addEventListener("click", async function (event) {
    event.preventDefault();
    const response = await fetch("views/register.html");
    const html = await response.text();
    document.body.innerHTML = html;
    document.title = "Sign Up";
    signInHandler();
    history.pushState({}, "", "/Register");
  });
}
