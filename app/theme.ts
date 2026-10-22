// Day/night: the page follows the device setting until a visitor picks a theme with the toggle.
// The choice is saved in localStorage and applied by themeScript before the page paints.

export const themeColors = { light: "#f2f3ee", dark: "#121611" };
export type Theme = keyof typeof themeColors;

// A chosen theme also sets the browser bar colour. It uses its own theme-color tag at the top of
// <head>, which browsers read before the ones from metadata (React re-adds those if they change).
const chosenColorId = "chosen-theme-color";

export function setChosenColor(theme: Theme) {
  let meta = document.getElementById(chosenColorId) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement("meta");
    meta.id = chosenColorId;
    meta.name = "theme-color";
    document.head.prepend(meta);
  }
  meta.content = themeColors[theme];
}

// Runs inline in <head>, so it repeats setChosenColor in plain script.
export const themeScript = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")return;document.documentElement.dataset.theme=t;var m=document.createElement("meta");m.id="${chosenColorId}";m.name="theme-color";m.content=${JSON.stringify(themeColors)}[t];document.head.prepend(m)}catch(e){}})()`;
