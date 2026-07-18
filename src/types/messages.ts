export interface MatchGameMessage {
	type: "MATCH_GAME";
	title: string;
	system: string;
	md5: string;
}

export type ExtensionMessage = MatchGameMessage;
