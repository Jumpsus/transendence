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
      setTheme(getPreferredTheme());
    });
}

function changeIcon(theme, label = null) {
  const moon = document.getElementById("moonIcon");
  const sun = document.getElementById("sunIcon");
  if (theme === "dark") {
    moon.style.display = "block";
    sun.style.display = "none";
  } else {
    sun.style.display = "block";
    moon.style.display = "none";
  }
  if (label) label.textContent = theme;
}

export function setupDarkModeToggle(label = null) {
  const modeSwitch = document.getElementById("modeSwitch");
  changeIcon(getPreferredTheme(), label);

  modeSwitch.addEventListener("click", () => {
    const theme = getPreferredTheme() == "light" ? "dark" : "light";
    changeIcon(theme, label);
    setStoredTheme(theme);
    setTheme(theme);
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!getStoredTheme()) changeIcon(getPreferredTheme(), label);
    });
}
