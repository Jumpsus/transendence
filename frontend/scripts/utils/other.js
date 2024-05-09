export function makeLinkActive(parent) {
  const currentUrl = window.location.pathname;
  const navLinks = parent.querySelectorAll("[data-link]");
  navLinks.forEach((link) => {
    if (link.getAttribute("href") === currentUrl) {
      link.classList.add("active");
      link.classList.add("text-body");
      link.classList.add("bg-body-tertiary");
      link.classList.remove("bg-transparent");
      link.classList.remove("text-body-tertiary");
    } else {
      link.classList.add("text-body-tertiary");
      link.classList.remove("active");
      link.classList.remove("text-body");
      link.classList.remove("bg-body-tertiary");
      link.classList.add("bg-transparent");
    }
  });
}
