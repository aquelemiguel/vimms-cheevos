import browser from "webextension-polyfill";
import { getAuthorization, isVariantSupported, searchTitle } from "../api/ra";
import { getRASystemId } from "../constants/systems";
import type { MatchGameMessageRequest } from "../types/messages";

// @ts-expect-error
browser.runtime.onMessage.addListener(async (m) => {
	const message = m as MatchGameMessageRequest;

	const authorization = await getAuthorization();
	if (!authorization) {
		return { type: "missingAuth" };
	}

	const system = getRASystemId(message.systemName);
	if (system === null || system.id === null) {
		return { type: "unsupportedSystem" };
	}
	if (!system.active) {
		return { type: "inactiveSystem" };
	}

	const gameId = await searchTitle(message.gameTitle, system.id);
	if (!gameId) {
		return { type: "notFound" };
	}

	const isSupported = await isVariantSupported(
		authorization,
		gameId,
		message.gameVariant,
	);
	return { type: "success", gameId, isSupported };
});
