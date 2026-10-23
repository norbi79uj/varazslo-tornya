import { mkdir, symlink, readlink } from "node:fs/promises";
export async function preparePagesFixture() {
  await mkdir("artifacts/pages", { recursive: true });
  try {
    await symlink("../..", "artifacts/pages/smaragdvolgy", "dir");
  } catch (error) {
    if (
      error.code !== "EEXIST" ||
      (await readlink("artifacts/pages/smaragdvolgy")) !== "../.."
    )
      throw error;
  }
  return "/artifacts/pages/smaragdvolgy/";
}
