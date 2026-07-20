import browser from "webextension-polyfill";
import type {
	MatchGameMessageRequest,
	MatchGameMessageResponse,
} from "../types/messages";
import type { VimmSystem } from "../types/vimm";

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
	const raRow = document.createElement("tr");

	raRow.innerHTML = `
    <td>RA</td>
    <td></td>
    <td>
      <span style="color: silver">Checking...</span>
      <div style="float: right; font-size: 90%; padding-top: 2px">
        <a href="#" class="external" style="display: none">Open RA</a>
      </div>
    </td>
  `;

	const raStatus = raRow.querySelector("span") as HTMLSpanElement;
	const raLink = raRow.querySelector("a") as HTMLAnchorElement;

	return { raRow, raStatus, raLink };
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

	const systemName = document.querySelector("main .sectionTitle")
		?.textContent as VimmSystem | undefined;
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
		systemName: VimmSystem,
	) {
		raStatus.textContent = "Checking...";
		raStatus.style.cssText = "color: silver";

		try {
			const response = await browser.runtime.sendMessage<
				MatchGameMessageRequest,
				MatchGameMessageResponse
			>({
				gameTitle,
				gameVariant,
				systemName,
			});

			if (response.type === "missingAuth") {
				raStatus.textContent = "Missing RA config!";
				return;
			}
			if (response.type === "notFound") {
				raStatus.textContent = "Not found";
				return;
			}
			if (
				response.type === "unsupportedSystem" ||
				response.type === "inactiveSystem"
			) {
				raStatus.textContent = "Unsupported system";
				return;
			}

			const { gameId, isSupported } = response;

			raStatus.textContent = isSupported ? "Supported" : "Unsupported";
			raStatus.style.cssText = isSupported
				? "color: var(--title-color)"
				: "color: silver";

			if (gameId !== null) {
				raLink.style.cssText = "";
				raLink.href = `https://retroachievements.org/game/${gameId}/hashes`;
			} else {
				raLink.style.cssText = "display: none";
			}
		} catch (err) {
			raStatus.textContent = "Error";
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
