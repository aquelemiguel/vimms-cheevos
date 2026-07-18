export type MatchGameMessageRequest = {
	gameTitle: string;
	gameVariant: string;
	systemName: string;
};

export type MatchGameMessageResponse =
	| {
			isMissingAuth: true;
	  }
	| {
			isMissingAuth: false;
			gameId: null;
			isSupported: false;
	  }
	| {
			isMissingAuth: false;
			gameId: number;
			isSupported: boolean;
	  };
