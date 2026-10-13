(function () {
"use strict";
var root = document.documentElement;
function currentTheme() {
var chosen = root.getAttribute("data-theme");
return chosen === "light" ? "light" : "dark";
}
function toggleTheme() {
var next = currentTheme() === "dark" ? "light" : "dark";
root.setAttribute("data-theme", next);
try {
localStorage.setItem("theme", next);
} catch (e) {
}
}
function setMenu(nav, button, open) {
nav.classList.toggle("is-open", open);
button.setAttribute("aria-expanded", open ? "true" : "false");
}
function initSectionNav() {
var nav = document.querySelector(".section-nav");
if (!nav) return;
var toggle = nav.querySelector(".section-nav-toggle");
var links = Array.prototype.slice.call(nav.querySelectorAll(".section-nav-list a"));
var targets = links.map(function (link) {
return document.getElementById(link.getAttribute("href").slice(1));
});
var header = document.querySelector(".site-header");
var pending = false;
function setOpen(open) {
nav.classList.toggle("is-open", open);
if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
}
function markCurrent() {
pending = false;
var line = (header ? header.offsetHeight : 0) + 48;
var current = 0;
for (var i = 0; i < targets.length; i++) {
if (targets[i] && targets[i].getBoundingClientRect().top <= line) current = i;
}
var doc = document.documentElement;
if (window.pageYOffset > 0 && window.innerHeight + window.pageYOffset >= doc.scrollHeight - 2) current = links.length - 1;
links.forEach(function (link, index) {
if (index === current) link.setAttribute("aria-current", "location");
else link.removeAttribute("aria-current");
});
}
function onScroll() {
if (pending) return;
pending = true;
window.requestAnimationFrame(markCurrent);
}
function onDocumentClick(event) {
if (!nav.classList.contains("is-open")) return;
if (!nav.contains(event.target) || event.target.closest(".section-nav-list a")) setOpen(false);
}
function onKeydown(event) {
if (event.key === "Escape") setOpen(false);
}
function onToggle() {
setOpen(!nav.classList.contains("is-open"));
}
if (toggle) toggle.addEventListener("click", onToggle);
document.addEventListener("click", onDocumentClick);
document.addEventListener("keydown", onKeydown);
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
markCurrent();
}
function initCvGate() {
var gate = document.querySelector(".cv-gate");
if (!gate) return;
var button = gate.querySelector(".cv-gate-button");
var template = gate.querySelector(".cv-gate-link");
if (!button || !template || !template.content) return;
function reveal() {
var link = template.content.firstElementChild.cloneNode(true);
link.href = gate.getAttribute("data-path").split("").reverse().join("");
link.setAttribute("download", link.href.split("/").pop());
button.parentNode.replaceChild(link, button);
link.focus();
}
button.addEventListener("click", reveal);
}
function init() {
var themeButton = document.querySelector(".theme-toggle");
if (themeButton) themeButton.addEventListener("click", toggleTheme);
initSectionNav();
initCvGate();
var nav = document.getElementById("site-nav");
var navButton = document.querySelector(".nav-toggle");
if (!nav || !navButton) return;
function onMenuButton() {
setMenu(nav, navButton, !nav.classList.contains("is-open"));
}
function onKeydown(event) {
if (event.key === "Escape") setMenu(nav, navButton, false);
}
function onNavClick(event) {
if (event.target.closest("a")) setMenu(nav, navButton, false);
}
navButton.addEventListener("click", onMenuButton);
document.addEventListener("keydown", onKeydown);
nav.addEventListener("click", onNavClick);
}
if (document.readyState === "loading") {
document.addEventListener("DOMContentLoaded", init);
} else {
init();
}
})();
