const mobileNavOpener = document.querySelector(
  "#site-header > .site-mobile-nav-opener"
);
const mobileNavigationCloseButton = document.querySelector(
  "#site-navigation > header > button"
);
const siteNavigation = document.getElementById("site-navigation");
const siteOverlayWhenNavOpened = document.getElementById(
  "site-overlay-when-nav-opened"
);
let timeoutToCloseOverlay = null;

function mobileNavOpenerClickListener() {
  clearTimeout(timeoutToCloseOverlay);
  siteNavigation.classList.remove("closed");
  siteOverlayWhenNavOpened.classList.remove("closed");
}

function listenerToCloseMobileNavigation() {
  siteNavigation.classList.add("closed");
  siteOverlayWhenNavOpened.classList.add("closing");
  timeoutToCloseOverlay = setTimeout(() => {
    siteOverlayWhenNavOpened.classList.remove("closing");
    siteOverlayWhenNavOpened.classList.add("closed");
  }, 500);
}

mobileNavOpener.addEventListener("click", mobileNavOpenerClickListener);
[siteOverlayWhenNavOpened, mobileNavigationCloseButton].forEach((element) => {
  element.addEventListener("click", listenerToCloseMobileNavigation);
});

console.log({ mobileNavOpener });
