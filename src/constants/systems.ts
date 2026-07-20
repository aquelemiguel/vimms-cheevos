import type { VimmSystem } from "../types/vimm";

export type RASystem = {
	id: number | null;
	active: boolean;
};

export const VimmRASystemMap = {
	"Atari 2600": {
		id: 25,
		active: true,
	},
	"Atari 5200": {
		id: 50,
		active: false,
	},
	Nintendo: {
		id: 7,
		active: true,
	},
	"Master System": {
		id: 11,
		active: true,
	},
	"Atari 7800": {
		id: 51,
		active: true,
	},
	"TurboGrafx-16": {
		id: 8,
		active: true,
	},
	Genesis: {
		id: 1,
		active: true,
	},
	"TurboGrafx-CD": {
		id: 76,
		active: true,
	},
	"Super Nintendo": {
		id: 3,
		active: true,
	},
	"CD-i": {
		id: 42,
		active: false,
	},
	"Sega CD": {
		id: 9,
		active: true,
	},
	Jaguar: {
		id: 17,
		active: true,
	},
	"Sega 32X": {
		id: 10,
		active: true,
	},
	Saturn: {
		id: 39,
		active: true,
	},
	PlayStation: {
		id: 12,
		active: true,
	},
	"Jaguar CD": {
		id: 77,
		active: true,
	},
	"Nintendo 64": {
		id: 2,
		active: true,
	},
	Dreamcast: {
		id: 40,
		active: true,
	},
	"PlayStation 2": {
		id: 21,
		active: true,
	},
	GameCube: {
		id: 16,
		active: true,
	},
	Xbox: {
		id: 22,
		active: false,
	},
	"Xbox 360": {
		id: null,
		active: false,
	},
	"Xbox 360 (Digital)": {
		id: null,
		active: false,
	},
	"PlayStation 3": {
		id: null,
		active: false,
	},
	Wii: {
		id: 19,
		active: true,
	},
	WiiWare: {
		id: 19,
		active: true,
	},
	"Game Boy": {
		id: 4,
		active: true,
	},
	Lynx: {
		id: 13,
		active: true,
	},
	"Game Gear": {
		id: 15,
		active: true,
	},
	"Virtual Boy": {
		id: 28,
		active: true,
	},
	"Game Boy Color": {
		id: 6,
		active: true,
	},
	"Game Boy Advance": {
		id: 5,
		active: true,
	},
	"Nintendo DS": {
		id: 18,
		active: true,
	},
	"PlayStation Portable": {
		id: 41,
		active: true,
	},
	"Nintendo 3DS": {
		id: 62,
		active: false,
	},
} satisfies Record<string, RASystem>;

export function getRASystem(system: VimmSystem): RASystem | null {
	return VimmRASystemMap[system];
}
