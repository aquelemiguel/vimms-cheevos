import browser from "webextension-polyfill";
import { getAuthorization, isGameFileSupported, searchTitle } from "../api/ra";
import { getRASystem } from "../constants/systems";
import type { MatchGameMessageRequest } from "../types/messages";
import type { VimmSystem } from "../types/vimm";

type TitleTransform = (title: string) => string;

const titleTransforms: Partial<Record<VimmSystem, TitleTransform>> = {
	Lynx: (str) => {
		return str.replace(/\.lyx$/, ".lnx");
	},
	"Atari 7800": (str) => {
		return str.replace(/\.bin$/, ".a78");
	},
	"PlayStation 2": (str) => {
		return str.replace(/\.iso/, "");
	},
	GameCube: (str) => {
		return str.replace(/\.iso/, "");
	},
	Wii: (str) => {
		return str.replace(/\.iso/, "");
	},
	WiiWare: (str) => {
		return str.replace(/\.wad/, "");
	},
};

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

	let normalizedFileName = message.game.fileName;

	if (message.system in titleTransforms) {
		const transform = titleTransforms[message.system];
		if (transform) {
			normalizedFileName = transform(normalizedFileName);
		}
	}

	const gameId = await searchTitle(message.game.title, system.id);
	if (!gameId) {
		return { type: "notFound" };
	}

	const isSupported = await isGameFileSupported(
		authorization,
		gameId,
		normalizedFileName,
		message.game.md5,
	);
	return { type: "success", gameId, isSupported };
});
