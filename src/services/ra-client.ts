import browser from "webextension-polyfill";
import { getAuthorization, isVariantSupported, searchTitle } from "../api/ra";
import type { MatchGameMessageRequest } from "../types/messages";

// @ts-expect-error
browser.runtime.onMessage.addListener(async (m) => {
	const message = m as MatchGameMessageRequest;

	const authorization = await getAuthorization();
	if (!authorization) {
		return { isMissingAuth: true };
	}

	const gameId = await searchTitle(message.gameTitle, message.systemName);
	if (!gameId) {
		return {
			gameId: null,
			isSupported: false,
			isMissingAuth: false,
		};
	}

	const isSupported = await isVariantSupported(
		authorization,
		gameId,
		message.gameVariant,
	);
	return { gameId, isSupported, isMissingAuth: false };
});
