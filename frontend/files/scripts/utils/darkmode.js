const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

export const getPreferredTheme = () => {
  const storedTheme = getStoredTheme();
  if (storedTheme) {
    return storedTheme;
  }

  const ret = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  return ret;
};

const setTheme = (theme) => {
  document.documentElement.setAttribute("data-bs-theme", theme);
};

export function setupDarkMode() {
  setTheme(getPreferredTheme());
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!getStoredTheme()) setTheme(getPreferredTheme());
    });
}

export function setupDarkModeToggle(el) {
  const modeSwitch = document.getElementById("modeSwitch");
  const moon = document.getElementById("moonIcon");
  const sun = document.getElementById("sunIcon");
  if (getPreferredTheme() === "dark") {
    moon.style.display = "block";
    sun.style.display = "none";
    if (el) el.textContent = "Dark";
  } else {
    sun.style.display = "block";
    moon.style.display = "none";
    if (el) el.textContent = "Light";
  }

  modeSwitch.addEventListener("click", () => {
    const theme = moon.style.display == "block" ? "light" : "dark";
    if (theme === "dark") {
      moon.style.display = "block";
      sun.style.display = "none";
      if (el) el.textContent = "Dark";
    } else {
      sun.style.display = "block";
      moon.style.display = "none";
      if (el) el.textContent = "Light";
    }
    setStoredTheme(theme);
    setTheme(theme);
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!getStoredTheme()) {
        if (getPreferredTheme() === "dark") {
          moon.style.display = "block";
          sun.style.display = "none";
          if (el) el.textContent = "Dark";
        } else {
          sun.style.display = "block";
          moon.style.display = "none";
          if (el) el.textContent = "Light";
        }
      }
    });
}
