# firefox-vicinae

This is a simple addon for [vicinae](https://github.com/vicinaehq/vicinae) adding a menu where you can search through your Firefox bookmarks, either opening it in your browser or copying it to your clipboard.

It supports these install methods on Linux:
- Flatpak
- System (via package manager)
- Snap

You can select your install method in the preferences and a custom profile override if necessary.

#### Running/Building

```bash
npm install
npm run dev
```
If you want to build the production bundle, simply run:

```bash
npm run build
```

#### Known Issues and Limitations
- Special URIs such as `about:config` will not open.
- Some bookmarks may miss their favicons.
- Opening in browser opens default browser instead of Firefox

#### Credits
- [Mozilla Firefox addon for Raycast](https://github.com/raycast/extensions/tree/5bbcff49cf3fbf9a3ddc9b66796692022a1b546a/extensions/mozilla-firefox)
- [Mozilla Firefox Icon by Morewaita](https://github.com/somepaulo/MoreWaita)
