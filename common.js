function flipOrNot(a, flag) {
	let step = 1 - flag * 2;
	return Array.from(a, (_, i) => a[flag * (a.length - 1) + step * i]);
}

export function checkIsNormal(url) {
	try {
		let hostname = (new URL(url)).hostname;
		if (!hostname) {
			throw new Error("Not a valid website");
		}
		return hostname;
	} catch (error) {
	}
}

export default async function insertIntoList(url, scheme) {
	let hostname;
	if (!(hostname = checkIsNormal(url))) {
		return;
	}
	let [ include, exclude ] = flipOrNot(["bList", "wList"], Boolean(scheme));
	let { [include]: iList, [exclude]: eList } = 
		await browser.storage.local.get([include, exclude]);
	iList ??= []; eList ??= [];
	if (!(iList.includes(hostname))) {
		iList.push(hostname);
	} else {
		return;
	}
	eList = eList.filter(x => x != hostname);
	await browser.storage.local.set(
		Object.fromEntries([include, exclude].map(
			(key, index) => [key, [iList, eList][index]]
		))
	);
	return hostname;
}
