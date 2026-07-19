import browser from "webextension-polyfill";

export async function buildVimmDialog() {
	const dialog = document.createElement("dialog");
	dialog.id = "raDialog";
	dialog.style.cssText =
		"border: 0px; padding: 0px; background-color: transparent; cursor: auto;";

	dialog.innerHTML = `
    <div style="text-align: center; font-size: 14pt">RetroAchievements Web API key</div>
    <div class="rounded" style="min-width: 420px; min-height: 50px; padding: 10px">
      <div style="min-width:320px; max-width:640px; overflow:auto">
        <div style="max-height: 80vh">
          <div>
            This extension needs you to bring your own personal Web API key to properly function. You can find it on your <a href="https://retroachievements.org/settings?tab=applications" target="_blank" class="external">RetroAchievements settings page</a>, under the "Applications" section.
          </div>
          <p style="font-size: 90%; color: silver">
            Your personal key is stored locally and is never sent anywhere except RetroAchievements. All code is open-source and can be found in <a href="https://github.com/aquelemiguel/vimms-cheevos" target="_blank" class="external">GitHub</a>.
          </p>
          <h4 style="color: var(--title-color); margin-bottom: 4px; margin-top: 4px">
            Username
          </h4>
          <input type="text" id="raUsernameInput" placeholder="Enter your username" style="width: 100%; box-sizing: border-box; flex: 1" />
          <h4 style="color: var(--title-color); margin-bottom: 4px; margin-top: 12px">
            Web API Key
          </h4>
          <input type="text" id="raWebApiKeyInput" placeholder="Enter your API key" style="width: 100%; box-sizing: border-box; flex: 1" />
        </div>
      </div>
    </div>
    <form method="dialog" style="text-align: center; margin-top: 4px">
      <input type="submit" value="Close">
    </form>
  `;

	const { raUsername, raWebApiKey } = await browser.storage.local.get([
		"raUsername",
		"raWebApiKey",
	]);

	const raUsernameInput = dialog.querySelector(
		"#raUsernameInput",
	) as HTMLInputElement;

	if (raUsername) {
		raUsernameInput.value = raUsername as string;
	}

	const raWebApiKeyInput = dialog.querySelector(
		"#raWebApiKeyInput",
	) as HTMLInputElement;

	if (raWebApiKey) {
		raWebApiKeyInput.value = raWebApiKey as string;
	}

	raUsernameInput.addEventListener("change", async () => {
		// TODO: add a debounce here
		await browser.storage.local.set({
			raUsername: raUsernameInput.value,
		});
	});

	raWebApiKeyInput.addEventListener("change", async () => {
		// TODO: add a debounce here
		await browser.storage.local.set({
			raWebApiKey: raWebApiKeyInput.value,
		});
	});

	return dialog;
}
