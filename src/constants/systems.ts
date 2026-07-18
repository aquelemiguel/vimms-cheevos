const VimmRASystemMap = {
	"Atari 2600": 25,
	"Atari 5200": 50,
	Nintendo: 7,
	"Master System": 11,
	"Atari 7800": 51,
	"TurboGrafx-16": 8,
	Genesis: 1,
	"TurboGrafx-CD": 76,
	"Super Nintendo": 3,
	"CD-i": 42,
	"Sega CD": 9,
	Jaguar: 17,
	"Sega 32X": 10,
	Saturn: 39,
	PlayStation: 12,
	"Jaguar CD": 77,
	"Nintendo 64": 2,
	Dreamcast: 40,
	"PlayStation 2": 21,
	GameCube: 16,
	Xbox: 22,
	"Xbox 360": null,
	"Xbox 360 (Digital)": null,
	"PlayStation 3": null,
	Wii: 19,
	WiiWare: 19,
	"Game Boy": 4,
	Lynx: 13,
	"Game Gear": 15,
	"Virtual Boy": 28,
	"Game Boy Color": 6,
	"Game Boy Advance": 5,
	"Nintendo DS": 18,
	"PlayStation Portable": 41,
	"Nintendo 3DS": 62,
} satisfies Record<string, number | null>;

export function getRASystemId(vimmSystem: string): number | null {
	if (vimmSystem in VimmRASystemMap) {
		return VimmRASystemMap[vimmSystem as keyof typeof VimmRASystemMap];
	}
	return null;
}
