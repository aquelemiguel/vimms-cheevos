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

	let normalizedTitle = message.game.fileName;

	if (message.game.fileName in titleTransforms) {
		const transform = titleTransforms[message.system];
		if (transform) {
			normalizedTitle = transform(normalizedTitle);
		}
	}

	const gameId = await searchTitle(message.game.title, system.id);
	if (!gameId) {
		return { type: "notFound" };
	}

	const isSupported = await isGameFileSupported(
		authorization,
		gameId,
		normalizedTitle,
		message.game.md5,
	);
	return { type: "success", gameId, isSupported };
});
