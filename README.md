# Vimm's Cheevos

[![Latest release](https://img.shields.io/github/v/release/aquelemiguel/vimms-cheevos?style=for-the-badge&color=blue&logo=github)](https://github.com/aquelemiguel/vimms-cheevos/releases)
[![Downloads](https://img.shields.io/github/downloads/aquelemiguel/vimms-cheevos/total?style=for-the-badge&color=success&logo=github)](https://github.com/aquelemiguel/vimms-cheevos/releases)
[![Stars](https://img.shields.io/github/stars/aquelemiguel/vimms-cheevos?style=for-the-badge&color=yellow&logo=github)](https://github.com/aquelemiguel/vimms-cheevos/stargazers)
[![Issues](https://img.shields.io/github/issues/aquelemiguel/vimms-cheevos?style=for-the-badge&color=orange)](https://github.com/aquelemiguel/vimms-cheevos/issues)

A cross-browser extension that checks whether a game file hosted on [Vimm's Lair](https://vimm.net/) is supported by [RetroAchievements](https://retroachievements.org/), matching files names using the No-Intro (cartridge-based systems) and Redump (disc-based systems) naming both sites share.

https://github.com/user-attachments/assets/c24849e6-5f24-4c0b-93a6-1d054bfe7dd3

## Installation

Check out the [Releases](https://github.com/aquelemiguel/vimms-cheevos/releases/latest) tab, download and extract the respective version for your browser.

### For Chromium-based browsers

1. Navigate to `chrome://extensions`
2. Enable **Developer mode** in the top-right
3. Click **Load unpacked**
4. Select the extracted folder

### For Firefox and their forks

1. Navigate to `about:debugging#/runtime/this-firefox`
2. Click **Load Temporary Add-on...**
3. Select the `manifest.json` file inside the extracted folder

#### RetroAchievements Web API key

This extension expects you have signed up for a RetroAchievements account as you'll need to provide your username and personal Web API key. This is because RA's API is designed around per-user keys and there's rate limiting in place. Read more about RA's [API access](https://api-docs.retroachievements.org/#api-access).

Your key is safely stored. Your key is never sent anywhere except to RetroAchievements.

## Usage

1. After installing via the steps above, open [Vimm's Lair](https://vimm.net/).
2. A new button is injected to the sidebar and clicking it opens a settings dialog for the extension.
3. Follow the instructions on screen - provide your RA username and personal Web API key.  
   As you type, the extension saves automatically.
5. Close the dialog and refresh.
6. Opening a game page should now show whether that specific variant is supported by RA.

<img width="392" height="247" alt="image" src="https://github.com/user-attachments/assets/bb22a9de-95e2-40fd-8b9d-461be1eff34e" />

<img width="392" height="247" alt="image" src="https://github.com/user-attachments/assets/d024fdb4-7c93-45b1-b8f5-6986fe47fc98" />

<img width="392" height="247" alt="image" src="https://github.com/user-attachments/assets/d18f9df1-2677-463d-b366-46f9bc223c43" />

<img width="392" height="247" alt="image" src="https://github.com/user-attachments/assets/ca1702d6-fddf-4e2f-922c-dce003b29183" />

## Contributing

Issues and pull requests are welcome. If you run into a game that reports incorrectly or a system that isn't working as expected, please open an issue with the game page URL and platform.

## Disclaimer

This project is not affiliated with Vimm's Lair or RetroAchievements. It simply cross-references publicly available data.

## License

MIT




