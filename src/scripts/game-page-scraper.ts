import browser from "webextension-polyfill";
import type {
	MatchGameMessageRequest,
	MatchGameMessageResponse,
} from "../types/messages";

function decodeDataV(el: Element) {
	const encoded = el.getAttribute("data-v");
	if (!encoded) {
		return null;
	}
	try {
		return atob(encoded);
	} catch {
		return null;
	}
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

function buildRaRow() {
	const rowContainer = document.createElement("tr");

	// TODO: incorporate logo somehow
	// const raRowLogo = document.createElement("img");

	// raRowLogo.src = browser.runtime.getURL("assets/ra-logo.png");
	// raRowLogo.height = 18;
	// raRowName.appendChild(raRowLogo);

	const rowName = document.createElement("td");
	rowName.textContent = "RA";
	rowContainer.appendChild(rowName);

	// empty td for spacing
	rowContainer.appendChild(document.createElement("td"));

	const rowRight = document.createElement("td");

	const rowStatus = document.createElement("span");
	rowStatus.textContent = "Checking...";

	const rowLinkContainer = document.createElement("div");
	rowLinkContainer.style = "float: right; font-size: 90%; padding-top: 2px";

	const rowLink = document.createElement("a");
	rowLink.href = "#";
	rowLink.textContent = "Open in RA";
	rowLink.className = "external";
	rowLink.style = "display:none";

	rowLinkContainer.appendChild(rowLink);

	rowRight.appendChild(rowStatus);
	rowRight.appendChild(rowLinkContainer);
	rowContainer.appendChild(rowRight);

	return { raRow: rowContainer, raStatus: rowStatus, raLink: rowLink };
}

(async () => {
	const header = document.querySelector("main h2 canvas");
	if (!header) {
		console.error("Failed to scrape game title");
		return;
	}
	const gameVariantEl = document.querySelector("#data-good-title > #canvas2");
	if (!gameVariantEl) {
		console.error("Failed to scrape game variant");
		return;
	}
	const systemName = document.querySelector("main .sectionTitle")?.textContent;
	if (!systemName) {
		console.error("Failed to scrape system name");
		return;
	}
	const detailsContainer = document.querySelector(".mainContent tr#row-date");
	if (!detailsContainer) {
		console.error("Failed to scrape details container");
		return;
	}

	const { raRow, raStatus, raLink } = buildRaRow();
	detailsContainer.after(raRow);

	const gameTitle = decodeDataV(header);
	// without game title we cannot get the RA ID for the game
	if (!gameTitle) {
		console.error("Failed to decode the game title");
		return;
	}

	async function checkVariantMatch(
		gameTitle: string,
		gameVariant: string,
		systemName: string,
	) {
		raStatus.textContent = "Checking...";

		try {
			const { gameId, isSupported } = await browser.runtime.sendMessage<
				MatchGameMessageRequest,
				MatchGameMessageResponse
			>({
				type: "MATCH_GAME",
				gameTitle,
				gameVariant,
				systemName: systemName,
			});

			raStatus.textContent = isSupported ? "Supported" : "Unsupported";

			if (gameId !== null) {
				raLink.style = "";
				raLink.href = `https://retroachievements.org/game/${gameId}/hashes`;
			} else {
				raLink.style = "display:none";
			}
		} catch (err) {
			raStatus.textContent = "Error!";
			console.error("RA match check failed:", err);
		}
	}

	const initialVariant = gameVariantEl.getAttribute("data-v");
	if (initialVariant) {
		checkVariantMatch(gameTitle, atob(initialVariant), systemName);
	}

	observeAttribute(gameVariantEl, "data-v", (raw) => {
		if (!raw) {
			return;
		}
		try {
			checkVariantMatch(gameTitle, atob(raw), systemName);
		} catch {
			// malformed data-v, ignoring...
		}
	});
})();
