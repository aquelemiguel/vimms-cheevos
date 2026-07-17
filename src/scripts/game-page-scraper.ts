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

	const systemTitle = document.querySelector("main .sectionTitle");
	if (!systemTitle) {
		return;
	}

	const gameTitle = atob(encodedGameTitle);
	console.log(gameTitle);

	const response = await browser.runtime.sendMessage({
		type: "MATCH_GAME", // TODO: type this later on
		title: gameTitle,
		system: systemTitle,
	});

	console.log(`response from worker: ${response}`);

	const raRow = document.createElement("tr");

	// TODO: use an anchor link here to point to matched guide
	const raRowName = document.createElement("td");

	// TODO: incorporate logo somehow
	// const raRowLogo = document.createElement("img");

	// raRowLogo.src = browser.runtime.getURL("assets/ra-logo.png");
	// raRowLogo.height = 18;
	// raRowName.appendChild(raRowLogo);
	raRowName.textContent = "RA";

	const raRowEmpty = document.createElement("td");

	const raRowStatus = document.createElement("td");
	raRowStatus.textContent = response ? "Supported" : "Unsupported";

	raRow.appendChild(raRowName);
	raRow.appendChild(raRowEmpty);
	raRow.appendChild(raRowStatus);

	const verifiedRow = document
		.querySelector(".mainContent tr#row-date")
		?.before(raRow);

	console.log(verifiedRow);
})();
