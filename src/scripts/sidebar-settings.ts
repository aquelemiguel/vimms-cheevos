function buildVimmDialog(title: string) {
	const dialog = document.createElement("dialog");
	dialog.id = "dialog";
	dialog.style.cssText =
		"border: 0px; padding: 0px; background-color: transparent; cursor: auto;";

	dialog.innerHTML = `
    <div style="text-align: center; font-size: 14pt">${title}</div>
    <div class="rounded" style="min-width: 420px; min-height: 50px; padding: 10px">
      <div style="min-width:320px; max-width:640px; overflow:auto">
        <div style="max-height: 80vh">
          <div>
            This extension needs you to bring your own personal Web API key to properly function. You can find it on your <a href="https://retroachievements.org/settings?tab=applications" target="_blank" class="external">RetroAchievements settings page</a>, under the "Applications" section.
          </div>
          <p style="font-size: 90%; color: silver">
            Your personal key is stored locally and is never sent anywhere except RetroAchievements. All code is open-source and can be found in <a href="https://github.com/aquelemiguel/vimms-cheevos" target="_blank" class="external">GitHub</a>.
          </p>
          <input type="text" id="raApiKeyInput" placeholder="Enter your API key" style="width: 100%; box-sizing: border-box; margin-top: 8px">
        </div>
      </div>
    </div>
    <form method="dialog" style="text-align: center; margin-top: 4px">
      <input type="submit" value="Close">
    </form>
  `;

	return dialog;
}

(() => {
	const sidebar = document.getElementById("mainMenu");
	if (!sidebar) {
		return;
	}

	const hr = document.createElement("div");
	hr.innerHTML = `<hr>`;
	sidebar.appendChild(hr);

	const anchor = document.createElement("a");
	anchor.href = "#";
	anchor.textContent = "RA Web API Key";
	sidebar.appendChild(anchor);

	const raWebApiKeyDialog = buildVimmDialog("RetroAchievements Web API key");
	document.body.appendChild(raWebApiKeyDialog);

	anchor.addEventListener("click", () => raWebApiKeyDialog.showModal());
})();
