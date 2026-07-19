import { buildVimmDialog } from "../components/dialog";

(async () => {
	const sidebar = document.getElementById("mainMenu");
	if (!sidebar) {
		return;
	}

	const hr = document.createElement("div");
	hr.innerHTML = `<hr>`;
	sidebar.appendChild(hr);

	const anchor = document.createElement("a");
	anchor.href = "javascript:void(0)";
	anchor.textContent = "Vimm's Cheevos";
	sidebar.appendChild(anchor);

	const dialog = await buildVimmDialog();
	document.body.appendChild(dialog);

	anchor.addEventListener("click", () => {
		dialog.showModal();
	});
})();
