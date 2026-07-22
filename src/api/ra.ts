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

export async function isGameFileSupported(
	authorization: AuthObject,
	gameId: number,
	fileName: string,
	md5?: string,
) {
	const hashes = await getGameHashes(authorization, { gameId });

	const normalize = (str: string) => {
		// strip out file extensions
		return str.toLowerCase().replace(/\.[^.]+$/, "");
	};

	for (const result of hashes.results) {
		if (
			// should be fool-proof for cartridge-based systems
			result.md5 === md5 ||
			// x-match no-intro/redump naming
			normalize(result.name) === normalize(fileName)
		) {
			return true;
		}
	}
	return false;
}

export async function searchTitleInSystem(query: string, systemId: number) {
	const res = await fetch(
		`https://retroachievements.org/internal-api/search?q=${query}&scope=games&page=1&perPage=50`,
		{
			method: "GET",
		},
	);
	const payload: RASearchResponse = await res.json();

	const normalizedQuery = query.trim().toLowerCase();

	// in RAWeb, exactness is underneath popularity score but we need exactness first,
	// otherwise e.g., q="Mega Man" outputs MMX (SNES) and MM2 (NES) before MM (NES)
	// see config/scout.php in https://github.com/RetroAchievements/RAWeb

	const games = [...payload.results.games].sort((a, b) => {
		const aExact = a.title.trim().toLowerCase() === normalizedQuery ? 1 : 0;
		const bExact = b.title.trim().toLowerCase() === normalizedQuery ? 1 : 0;
		return bExact - aExact;
	});

	for (const game of games) {
		if (game.system.id === systemId) {
			return game.id;
		}
	}
	return null;
}
