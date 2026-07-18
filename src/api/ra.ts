import { buildAuthorization, getGameHashes } from "@retroachievements/api";
import browser from "webextension-polyfill";
import { getRASystemId } from "../constants/systems";
import type { RASearchResponse } from "../types/ra";

async function getAuthObject() {
	const { raUsername, raWebApiKey } = (await browser.storage.local.get([
		"raUsername",
		"raWebApiKey",
	])) as {
		raUsername?: string;
		raWebApiKey?: string;
	};
	if (!raUsername || !raWebApiKey) {
		return;
	}

	return buildAuthorization({
		username: raUsername,
		webApiKey: raWebApiKey,
	});
}

export async function isVariantSupported(gameId: number, gameVariant: string) {
	const authorization = await getAuthObject();
	if (!authorization) {
		return false; // TODO: probably throw some specific error here
	}

	const hashes = await getGameHashes(authorization, { gameId });

	for (const result of hashes.results) {
		if (result.name === gameVariant) {
			return true;
		}
	}
	return false;
}

export async function searchTitle(query: string, vimmSystem: string) {
	const systemId = getRASystemId(vimmSystem);
	if (!systemId) {
		return null; // parsed vimm system somehow doesn't map to any RA system
	}

	const res = await fetch(
		`https://retroachievements.org/internal-api/search?q=${query}&scope=games`,
		{
			method: "GET",
		},
	);

	const payload: RASearchResponse = await res.json();

	for (const game of payload.results.games) {
		if (game.system.id === systemId) {
			return game.id;
		}
	}
	return null;
}
