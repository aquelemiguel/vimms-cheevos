import type { VimmSystem } from "./vimm";

export type MatchGameMessageRequest = {
	system: VimmSystem;
	game: {
		title: string;
		fileName: string;
		md5?: string;
	};
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
