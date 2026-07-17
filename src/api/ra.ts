import { buildAuthorization, getGameHashes } from "@retroachievements/api";

function getAuthObject() {
	return buildAuthorization({
		username: import.meta.env.VITE_RA_USERNAME,
		webApiKey: import.meta.env.VITE_RA_WEB_API_KEY,
	});
}

export async function isHashSupported(gameId: number, hash: string) {
	const authorization = getAuthObject();

	const hashes = await getGameHashes(authorization, { gameId });
	console.log(hashes);

	for (const result of hashes.results) {
		if (result.md5 === hash) {
			return true;
		}
	}
	return false;
}
