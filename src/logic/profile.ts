import { getPreferenceValues } from "@vicinae/api"
import { readdirSync, existsSync } from "fs"
import * as os from "os"

function getMozillaFolder(): string {
  const install_method = getPreferenceValues()
  const username = os.userInfo().username
  switch (install_method["install-method"]) {
    case "Flatpak":
      return `/home/${username}/.var/app/org.mozilla.firefox/.mozilla/firefox/`
    case "System":
      return `/home/${username}/.mozilla/firefox/`
    case "Snap":
      return `/home/${username}/snap/firefox/common/.mozilla/firefox/`
  }
  return ""
}

export function getValidProfile(): string {
  const mozilla_folder = getMozillaFolder()
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
