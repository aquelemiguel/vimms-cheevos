export interface MatchGameMessageRequest {
	type: "MATCH_GAME";
	gameTitle: string;
	gameVariant: string;
	system: string;
}

export interface MatchGameMessageResponse {
	gameId: number | null;
	isSupported: boolean;
}
