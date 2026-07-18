type RASearchScope = "games"; // only typing games for the time being

export interface RASearchSystem {
	id: number;
	name: string;
	iconUrl: string;
	nameShort: string;
}

export interface RASearchGame {
	id: number;
	title: string;
	achievementsPublished: number;
	playersTotal: number;
	pointsTotal: number;
	badgeUrl: string;
	system: RASearchSystem;
}

export interface RASearchResponse {
	results: { games: RASearchGame[] };
	query: string;
	scopes: RASearchScope[];
	scopeRelevance: Record<RASearchScope, number>;
}
