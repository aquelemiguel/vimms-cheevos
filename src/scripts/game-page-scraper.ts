import browser from "webextension-polyfill";
import type {
	MatchGameMessageRequest,
	MatchGameMessageResponse,
} from "../types/messages";

function decodeTitleFromDataV(el: Element) {
	const encodedTitle = el.getAttribute("data-v");
	if (!encodedTitle) {
		return null;
	}
	return atob(encodedTitle);
}

function observeAttribute(
	target: Element,
	attrName: string,
	cb: (newValue: string | null) => void,
) {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (
				mutation.type === "attributes" &&
				mutation.attributeName === attrName
			) {
				cb(target.getAttribute(attrName));
			}
		}
	});

	observer.observe(target, {
		attributes: true,
		attributeFilter: [attrName],
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

	const gameTitle = decodeTitleFromDataV(header);
	// without game title we cannot get the RA ID for the game
	if (!gameTitle) {
		return;
	}

	const systemTitle = document.querySelector("main .sectionTitle")?.textContent;
	if (!systemTitle) {
		return;
	}

	async function checkVariantMatch(
		gameTitle: string,
		gameVariant: string,
		systemTitle: string,
	) {
		raRowRightValue.textContent = "Checking...";

		const response = await browser.runtime.sendMessage<
			MatchGameMessageRequest,
			MatchGameMessageResponse
		>({
			type: "MATCH_GAME",
			gameTitle,
			gameVariant,
			system: systemTitle,
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

	const gameVariantEl = document.querySelector("#data-good-title > #canvas2");
	if (!gameVariantEl) {
		return;
	}

	const initialRun = gameVariantEl.getAttribute("data-v");
	if (initialRun) {
		checkVariantMatch(gameTitle, atob(initialRun), systemTitle);
	}

	observeAttribute(gameVariantEl, "data-v", (newValue) => {
		if (!newValue) {
			return;
		}
		checkVariantMatch(gameTitle, atob(newValue), systemTitle);
	});

	// TODO: incorporate logo somehow
	// const raRowLogo = document.createElement("img");

	// raRowLogo.src = browser.runtime.getURL("assets/ra-logo.png");
	// raRowLogo.height = 18;
	// raRowName.appendChild(raRowLogo);
})();
