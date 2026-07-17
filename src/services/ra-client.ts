import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(async (message, sender) => {
	if (message.type === "MATCH_GAME") {
		// TODO: actually call api here
		return true;
	}
});
