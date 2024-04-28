import { editProfile } from "./profile.js";

export function navHandler() {
  async function changeView(event) {
    event.preventDefault();
    const src = event.currentTarget.href;
    let title = event.currentTarget.innerText;
    if (title === "") title = "Profile";
    const url = title.split(" ").join("");
    const response = await fetch(src);
    const html = await response.text();
    document.getElementById("content-wrapper").innerHTML = html;
    document.title = title;
    if (title === "Profile") editProfile();
    history.pushState({}, "", url);
  }

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
      changeView(event);
    });
  });
}
