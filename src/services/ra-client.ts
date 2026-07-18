import browser from "webextension-polyfill";
import { isHashSupported, searchTitle } from "../api/ra";

browser.runtime.onMessage.addListener(async (message, sender) => {
	const gameId = await searchTitle(message.title, message.system);
	if (!gameId) {
		return false;
	}

	if (message.type === "MATCH_GAME") {
		return isHashSupported(gameId, message.md5);
	}
});
