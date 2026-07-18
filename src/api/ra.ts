import { buildAuthorization, getGameHashes } from "@retroachievements/api";
import { getRASystemId } from "../constants/systems";
import type { RASearchResponse } from "../types/ra";

function getAuthObject() {
	return buildAuthorization({
		username: import.meta.env.VITE_RA_USERNAME,
		webApiKey: import.meta.env.VITE_RA_WEB_API_KEY,
	});
}

export async function isHashSupported(gameId: number, hash: string) {
	const authorization = getAuthObject();
	const hashes = await getGameHashes(authorization, { gameId });

	for (const result of hashes.results) {
		if (result.md5 === hash) {
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
	console.log(payload);

	for (const game of payload.results.games) {
		if (game.system.id === systemId) {
			return game.id;
		}
	}
	return null;
}
