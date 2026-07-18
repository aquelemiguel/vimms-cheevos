import browser from "webextension-polyfill";
import type {
	MatchGameMessageRequest,
	MatchGameMessageResponse,
} from "../types/messages";

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

	const raRowRight = document.createElement("td");

	const raRowRightValue = document.createElement("span");
	raRowRightValue.textContent = "Checking...";

	const raRowRightLinkContainer = document.createElement("div");
	raRowRightLinkContainer.style =
		"float: right; font-size: 90%; padding-top: 2px";

	const raRowRightLink = document.createElement("a");
	raRowRightLink.href = "#";
	raRowRightLink.textContent = "Open in RA";
	raRowRightLink.className = "external";
	raRowRightLink.style = "display:none";

	raRowRightLinkContainer.appendChild(raRowRightLink);

	raRowRight.appendChild(raRowRightValue);
	raRowRight.appendChild(raRowRightLinkContainer);
	raRow.appendChild(raRowRight);

	document.querySelector(".mainContent tr#row-date")?.after(raRow);

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

	async function checkHashMatch(md5: string) {
		raRowRightValue.textContent = "Checking...";

		const response = await browser.runtime.sendMessage<
			MatchGameMessageRequest,
			MatchGameMessageResponse
		>({
			type: "MATCH_GAME",
			title: gameTitle,
			system: systemTitle?.textContent ?? "",
			md5,
		});

		raRowRightValue.textContent = response.isSupported
			? "Supported"
			: "Unsupported";

		if (response.gameId !== null) {
			raRowRightLink.style = "";
			raRowRightLink.href = `https://retroachievements.org/game/${response.gameId}/hashes`;
		} else {
			raRowRightLink.style = "display:none";
		}
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
