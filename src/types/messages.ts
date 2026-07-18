export interface MatchGameMessageRequest {
	type: "MATCH_GAME";
	title: string;
	system: string;
	md5: string;
}

export interface MatchGameMessageResponse {
	gameId: number | null;
	isSupported: boolean;
}
