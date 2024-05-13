const getStoredTheme = () => localStorage.getItem("theme");
const setStoredTheme = (theme) => localStorage.setItem("theme", theme);

const getPreferredTheme = () => {
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

export function setupDarkModeToggle() {
    const modeSwitch = document.getElementById("modeSwitch");
    if (getPreferredTheme() === "dark") modeSwitch.checked = true;
	else modeSwitch.checked = false;

    modeSwitch.addEventListener("change", () => {
      const theme = modeSwitch.checked ? "dark" : "light";
      setStoredTheme(theme);
      setTheme(theme);
    });

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", () => {
        if (!getStoredTheme()) {
          if (getPreferredTheme() === "dark") modeSwitch.checked = true;
		  else modeSwitch.checked = false;
        }
      });
  }
