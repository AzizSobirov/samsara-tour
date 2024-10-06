import fs from "fs/promises";
import path from "path";
import fsExtra from "fs-extra";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dirs
const rootDir = path.resolve(__dirname, "../../");
const publicDir = path.resolve(rootDir, "public");
const assetsDir = path.resolve(publicDir, "assets");
const scssDir = path.resolve(publicDir, "assets/scss");
const componentDir = path.resolve(rootDir, "src/components");
const resourcesDir = path.resolve(__dirname, "./resources");

// Helper function to create directories and files
async function createFile(filePath, fileName, fileContent) {
  try {
    const file = path.join(filePath, fileName);

    // Check if the file already exists
    try {
      await fs.access(file);
      throw new Error(`The file "${fileName}" already exists.`);
    } catch (err) {
      // If the file does not exist, create it
      if (err.code === "ENOENT") {
        await fs.writeFile(file, fileContent);
        console.log(`File "${fileName}" created successfully.`);
      } else {
        throw err; // Re-throw error if it's not a "file not found" error
      }
    }
  } catch (error) {
    console.error(`Error creating file "${fileName}": \n${error.message}`);
    throw error;
  }
}

export {
  fs,
  fsExtra,
  path,
  rootDir,
  publicDir,
  assetsDir,
  scssDir,
  componentDir,
  resourcesDir,
  createFile,
};
