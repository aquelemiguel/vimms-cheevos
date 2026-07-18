import browser from "webextension-polyfill";
import type { MatchGameMessage } from "../types/messages";

function observeTextContent(target: Node, cb: (newText: string) => void) {
	const observer = new MutationObserver(() => {
		cb(target.textContent ?? "");
	});

	observer.observe(target, {
		characterData: true,
		childList: true,
		subtree: true,
	});

	return () => observer.disconnect();
}

(async () => {
	const raRow = document.createElement("tr");

	const raRowName = document.createElement("td");
	raRowName.textContent = "RA";
	raRow.appendChild(raRowName);

	raRow.appendChild(document.createElement("td"));

	const raRowStatus = document.createElement("td");
	raRowStatus.textContent = "Checking...";
	raRow.appendChild(raRowStatus);

	document.querySelector(".mainContent tr#row-date")?.before(raRow);

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

	async function checkHashMatch(md5: string) {
		raRowStatus.textContent = "Checking...";

		const response = await browser.runtime.sendMessage<
			MatchGameMessage,
			boolean
		>({
			type: "MATCH_GAME",
			title: gameTitle,
			system: systemTitle?.textContent ?? "",
			md5,
		});

		raRowStatus.textContent = response ? "Supported" : "Unsupported";
	}

	const md5Hash = document.querySelector(".goodHash #data-md5");
	if (!md5Hash) {
		return;
	}

	checkHashMatch(md5Hash.textContent);
	observeTextContent(md5Hash, checkHashMatch);

	// TODO: incorporate logo somehow
	// const raRowLogo = document.createElement("img");

	// raRowLogo.src = browser.runtime.getURL("assets/ra-logo.png");
	// raRowLogo.height = 18;
	// raRowName.appendChild(raRowLogo);
})();
