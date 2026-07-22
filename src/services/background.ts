import browser from "webextension-polyfill";
import {
	getAuthorization,
	isGameFileSupported,
	searchTitleInSystem,
} from "../api/ra";
import { getRASystem } from "../constants/systems";
import type { MatchGameMessageRequest } from "../types/messages";

async function checkForUpdate() {
	try {
		const res = await fetch(
			"https://api.github.com/repos/aquelemiguel/vimms-cheevos/releases/latest",
		);
		if (!res.ok) {
			return;
		}

		const { tag_name: tagName } = (await res.json()) as { tag_name: string };
		const latestVersion = tagName.replace("v", "");

		await browser.storage.local.set({ latestVersion });
	} catch {
		// whatever, we'll retry later
	}
}

browser.runtime.onInstalled.addListener(checkForUpdate);

// polls for a new update every 6 hours
browser.alarms.create("checkForUpdate", { periodInMinutes: 60 * 6 });

browser.alarms.onAlarm.addListener((alarm) => {
	if (alarm.name === "checkForUpdate") {
		checkForUpdate();
	}
});

// @ts-expect-error
browser.runtime.onMessage.addListener(async (m) => {
	const message = m as MatchGameMessageRequest;

	const authorization = await getAuthorization();
	if (!authorization) {
		return { type: "missingAuth" };
	}

	const system = getRASystem(message.system);
	if (system === null || system.id === null) {
		return { type: "unsupportedSystem" };
	}
	if (!system.active) {
		return { type: "inactiveSystem" };
	}

	const gameId = await searchTitleInSystem(message.game.title, system.id);
	if (!gameId) {
		return { type: "notFound" };
	}

	const isSupported = await isGameFileSupported(
		authorization,
		gameId,
		message.game.fileName,
		message.game.md5,
	);
	return { type: "success", gameId, isSupported };
});
