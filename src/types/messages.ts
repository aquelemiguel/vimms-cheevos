export interface MatchGameMessageRequest {
	gameTitle: string;
	gameVariant: string;
	systemName: string;
}

export interface MatchGameMessageResponse {
	gameId: number | null;
	isSupported: boolean;
}
