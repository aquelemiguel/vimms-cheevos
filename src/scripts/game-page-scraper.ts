import browser from "webextension-polyfill";

(async () => {
	const header = document.querySelector("main h2 canvas");
	if (!header) {
		return;
	}

	const encodedGameTitle = header.getAttribute("data-v");
	// TODO: if cannot find, try scraping the filename
	if (!encodedGameTitle) {
		return;
	}

	const gameTitle = atob(encodedGameTitle);
	console.log(gameTitle);

	const response = await browser.runtime.sendMessage({
		type: "MATCH_GAME", // TODO: i could type this later on
		title: gameTitle,
	});

	console.log(`response from worker: ${response}`);
})();
