import { getPreferenceValues } from "@vicinae/api"
import { existsSync, readdirSync } from "fs"
import * as os from "os"

// Common name, organization name, product name
function getBrowserFolder(): [string, string, string] {
  const browser = getPreferenceValues()["browser"]
  switch (browser) {
    case "Firefox":
      return ["org.mozilla.firefox", ".mozilla/firefox", "firefox"]
    case "Zen":
      return ["app.zen_browser.zen", ".zen", "zen"]
    case "Mullvad":
      return ["net.mullvad.MullvadBrowser", ".mullvad-browser", "mullvad"]
    case "Librewolf":
      return ["io.gitlab.librewolf-community", ".librewolf", "librewolf"]
    case "Floorp":
      return ["one.ablaze.floorp", ".floorp", "floorp"]
    case "IceCat":
      return ["", ".mozilla/icecat", "icecat"]
  }
  return ["", "", ""]
}

function getMozillaFolder(): string {
  const browser_folder = getBrowserFolder()
  const prefs = getPreferenceValues()
  const username = os.userInfo().username
  if (prefs["install_method"] === "Flatpak" && prefs["browser"] == "IceCat") {
    throw Error("GNU IceCat does not have a flatpak version!")
  }
  switch (prefs["install-method"]) {
    case "Flatpak":
      return `/home/${username}/.var/app/${browser_folder[0]}/${browser_folder[1]}`
    case "System":
      return `/home/${username}/${browser_folder[1]}/`
    case "Snap":
      return `/home/${username}/snap/${browser_folder[2]}/common/${browser_folder[1]}/`
  }
  return ""
}

export function getValidProfile(): string {
  const mozilla_folder = getMozillaFolder()
  let exists = existsSync(mozilla_folder)
  if (!exists) {
    throw new Error(
      `Selected configuration not found! Did you specify your installation properly? Check if this folder exists: ${mozilla_folder}`,
    )
  }
  const override_profile: string = getPreferenceValues()["profile"]
  if (override_profile) {
    return `${mozilla_folder}/${override_profile}`
  }
  const valid_profiles = readdirSync(mozilla_folder).filter(
    x =>
      x.includes(".") &&
      !x.includes(".ini") &&
      existsSync(`${mozilla_folder}/${x}/bookmarkbackups`),
  )
  if (valid_profiles.length == 0) {
    throw new Error("No Valid Profiles found!")
  }
  return `${mozilla_folder}/${valid_profiles[0]}`
}
