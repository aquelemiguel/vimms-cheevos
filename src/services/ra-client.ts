import browser from "webextension-polyfill";
import { isVariantSupported, searchTitle } from "../api/ra";

browser.runtime.onMessage.addListener(async (message, sender) => {
	const gameId = await searchTitle(message.gameTitle, message.system);
	if (!gameId) {
		return {
			gameId: null,
			isSupported: false,
		};
	}

	if (message.type === "MATCH_GAME") {
		const isSupported = await isVariantSupported(gameId, message.gameVariant);

		return {
			gameId,
			isSupported,
		};
	}
});
