export function makeLinkActive(parent, isMenu) {
  let currentUrl = window.location.pathname;
  if (currentUrl === "/Game") currentUrl = "/";
  if (isMenu) {
	const secondSlashIndex = currentUrl.indexOf("/", 1);
	currentUrl =
	  secondSlashIndex === -1
		? currentUrl
		: currentUrl.slice(0, secondSlashIndex);
  }
  const navLinks = parent.querySelectorAll("[data-link]");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

export function arrayFromMultiPath(url) {
  let parts = url.split("/").filter(Boolean);
  parts = parts.map((part) => "/" + part);
  if (parts.length == 0) parts = ["/"];
  return parts;
}
