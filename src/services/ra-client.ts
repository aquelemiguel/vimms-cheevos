import browser from "webextension-polyfill";
import { isHashSupported } from "../api/ra";

browser.runtime.onMessage.addListener(async (message, sender) => {
	console.log(message);

	if (message.type === "MATCH_GAME") {
		return isHashSupported(1, message.md5);
	}
});
