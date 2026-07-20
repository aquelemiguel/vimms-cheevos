import {
	type AuthObject,
	buildAuthorization,
	getGameHashes,
} from "@retroachievements/api";
import browser from "webextension-polyfill";
import type { RASearchResponse } from "../types/ra";

export async function getAuthorization() {
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

export async function isVariantSupported(
	authorization: AuthObject,
	gameId: number,
	gameVariant: string,
) {
	const hashes = await getGameHashes(authorization, { gameId });

	for (const result of hashes.results) {
		// TODO: perhaps add a normalization function here that parses a
		// game file name into chunks (title, region, revision, lang, ...)
		if (result.name.toLowerCase() === gameVariant.toLowerCase()) {
			return true;
		}
	}
	return false;
}

export async function searchTitle(query: string, systemId: number) {
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
