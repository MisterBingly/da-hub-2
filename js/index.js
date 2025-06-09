import { openWindow } from "./utils.js";

const baseURL = window.location.origin + window.location.pathname.replace(/\/[^\/]+$/, "/");
const button = document.getElementById("oMSB");

if (("standalone" in window.navigator) && window.navigator.standalone) {
  // The site is running in standalone mode (e.g., on iOS home screen)
  window.location.replace(`${baseURL}home.html?iframe=true`);
} else {
  // The site is running in a browser
  button.addEventListener("click", () => {
    openWindow(`${baseURL}home.html?iframe=true`);
    window.location.replace("https://google.com");
  });
}
