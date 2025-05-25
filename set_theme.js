let originalColorScheme, bList = [], wList = [];

function setScheme(value) {
	if (value == "default") {
		value = originalColorScheme;
	}
	browser.browserSettings.overrideContentColorScheme.set({ value: value });
}

function procTab(tab) {
	browser.storage.local.get(["bList", "wList"]).then(items => {
		if ("bList" in items) {
			bList = items.bList;
		}
		if ("wList" in items) {
			wList = items.wList;
		}
	});

	let url = new URL(tab.url);
	if (wList.includes(url.hostname)) {
		setScheme("light");
	} else if (bList.includes(url.hostname)) {
		setScheme("dark");
	} else {
		setScheme("default");
	}
}

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
	// procTab(tab);
	procTab((await browser.tabs.query({ active: true }))[0]);
});

browser.tabs.onActivated.addListener(async activeInfo => {
	procTab(await browser.tabs.get(activeInfo.tabId));
});

browser.browserSettings.overrideContentColorScheme.get({}).then(got => {
	originalColorScheme = got.value;
});
