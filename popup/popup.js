import insertIntoList, { checkIsNormal } from "../common.js";

let currentTab;

let buttons = document.querySelectorAll("button");

buttons.forEach(e => {
	e.textContent = browser.i18n.getMessage(e.id);
});

buttons[0].addEventListener("click", async () => {
	if (await insertIntoList(currentTab.url, 0)) {
		browser.browserSettings.overrideContentColorScheme.set({ value: "dark" });
	}
});

buttons[1].addEventListener("click", async () => {
	if (await insertIntoList(currentTab.url, 1)) {
		browser.browserSettings.overrideContentColorScheme.set({ value: "light" });
	}
});

buttons[2].addEventListener("click", () => {
	browser.tabs.create({
		url: "../panel/panel.html"
	});
});

(async () => {
	currentTab = (await browser.tabs.query({ active: true }))[0];
	if (!checkIsNormal(currentTab.url)) {
		buttons[0].disabled = true;
		buttons[1].disabled = true;
	}
})();
