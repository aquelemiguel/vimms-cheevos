export interface MatchGameMessageRequest {
	type: "MATCH_GAME";
	gameTitle: string;
	gameVariant: string;
	systemName: string;
}

export interface MatchGameMessageResponse {
	gameId: number | null;
	isSupported: boolean;
}
