import insertIntoList from "../common.js";

let divs = document.querySelectorAll("div");

async function renderOption(select) {
	let list = select.parentNode.id;
	select.innerHTML = "";
	(((await browser.storage.local.get(list))[list]) ?? []).forEach(val => {
		select.options.add(new Option(val));
	});
}

divs.forEach((e, i) => {
	let buttons = e.querySelectorAll("button"), select = e.querySelector("select");

	buttons[0].addEventListener("click", async () => {
		let val = e.querySelector("input").value.replace(/^(?![\w]+:\/\/)/, "http://");
		let hostname;
		if (hostname = (await insertIntoList(val, e.id == "wList"))) {
			select.options.add(new Option(hostname));
			renderOption(divs[+!i].querySelector("select"));
		}
	});

	buttons[1].addEventListener("click", () => {
		select.querySelectorAll("option:checked").forEach(el => el.remove());
		browser.storage.local.set({
			[e.id]: Array.from(select.querySelectorAll("option")).map(el => el.innerHTML)
		});
	});

	e.querySelector("h4").innerHTML = browser.i18n.getMessage(`${e.id.toLowerCase()}_header`);

	addEventListener("focus", () => renderOption(select));
});
