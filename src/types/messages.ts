export type MatchGameMessageRequest = {
	gameTitle: string;
	gameVariant: string;
	systemName: string;
};

export type MatchGameMessageResponse =
	| {
			type: "success";
			gameId: number;
			isSupported: boolean;
	  }
	| {
			type: "missingAuth";
	  }
	| {
			type: "unsupportedSystem";
	  }
	| {
			type: "inactiveSystem";
	  }
	| {
			type: "notFound";
	  };
