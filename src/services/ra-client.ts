import browser from "webextension-polyfill";
import { isVariantSupported, searchTitle } from "../api/ra";
import type { MatchGameMessageRequest } from "../types/messages";

// @ts-expect-error
browser.runtime.onMessage.addListener(async (m) => {
	const message = m as MatchGameMessageRequest;

	const gameId = await searchTitle(message.gameTitle, message.systemName);
	if (!gameId) {
		return {
			gameId: null,
			isSupported: false,
		};
	}

	const isSupported = await isVariantSupported(gameId, message.gameVariant);
	return { gameId, isSupported };
});
