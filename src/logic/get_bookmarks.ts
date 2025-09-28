import { lstatSync, promises, readdirSync } from "fs"
import { decodeLZ4 } from "../utils/utils"
import { getValidProfile } from "./profile"
import * as path from "path"

export async function extractBookmarks() {
  const profile_folder = getValidProfile()
  const base_path = `${profile_folder}/bookmarkbackups/`
  const latest_file = readdirSync(base_path)
    .filter(file => lstatSync(path.join(base_path, file)).isFile())
    .map(file => ({
      file,
      mtime: lstatSync(path.join(base_path, file)).mtime,
    }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
  if (latest_file.length == 0) {
    throw Error("No bookmark backups found!")
  }
  const fileBuffer = await promises.readFile(
    `${profile_folder}/bookmarkbackups/${latest_file[0].file}`,
  )
  const rawBookmarks = decodeLZ4(fileBuffer)
  return rawBookmarks
}
