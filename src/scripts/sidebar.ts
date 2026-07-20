import browser from "webextension-polyfill";
import { buildVimmDialog } from "../components/dialog";

(async () => {
	const sidebar = document.getElementById("mainMenu");
	if (!sidebar) {
		return;
	}

	const { name, version } = browser.runtime.getManifest();
	const { latestVersion } = await browser.storage.local.get("latestVersion");

	const sidebarTitle =
		latestVersion === version ? name : `${name} (Update available)`;

	const hr = document.createElement("div");
	hr.innerHTML = `<hr>`;
	sidebar.appendChild(hr);

	const anchor = document.createElement("a");
	anchor.href = "javascript:void(0)";
	anchor.textContent = sidebarTitle;
	sidebar.appendChild(anchor);

	const dialog = await buildVimmDialog();
	document.body.appendChild(dialog);

	anchor.addEventListener("click", () => {
		dialog.showModal();
	});
})();
