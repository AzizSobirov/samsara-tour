import { promises as fs } from "fs";
import { join, relative, dirname, basename } from "path";
import { fileURLToPath } from "url";

function astroAutoImportComponents() {
  return {
    name: "astro-auto-import-components",
    hooks: {
      "astro:config:setup": async ({ updateConfig, config }) => {
        const componentsDir = join(
          fileURLToPath(config.root),
          "src/components"
        );
        const uiDir = join(fileURLToPath(config.root), "src/ui");
        const scssDir = join(
          fileURLToPath(config.root),
          "public/assets/scss/components"
        );

        // Helper function to recursively get all .astro files
        async function getAllAstroFiles(dir) {
          let results = [];
          const list = await fs.readdir(dir, { withFileTypes: true });
          for (const file of list) {
            const fullPath = join(dir, file.name);
            if (file.isDirectory()) {
              results = results.concat(await getAllAstroFiles(fullPath));
            } else if (file.isFile() && file.name.endsWith(".astro")) {
              results.push(fullPath);
            }
          }
          return results;
        }

        async function getAllScssFiles(dir) {
          let results = [];
          const list = await fs.readdir(dir, { withFileTypes: true });
          for (const file of list) {
            const fullPath = join(dir, file.name);
            if (
              file.isFile() &&
              file.name.endsWith(".scss") &&
              !file.name.endsWith("_index.scss")
            ) {
              results.push(fullPath);
            }
          }
          return results;
        }

        // Helper function to generate imports and declarations
        async function generateImportsAndDeclarations(
          dir,
          outputFile,
          basePath
        ) {
          const files = await getAllAstroFiles(dir);

          const names = [];
          const imports = files
            .map((file) => {
              const relativePath = relative(dir, file).replace(/\\/g, "/");
              const dirPath = dirname(relativePath);
              const fileName = basename(file, ".astro");
              const isIndexFile = fileName === "index";
              const folders = dirPath.split("/").filter(Boolean);

              // Determine import name
              let importName;
              if (isIndexFile) {
                importName = folders.join("_"); // Join all folder names with underscore
              } else {
                importName = `${folders.join("_")}_${fileName}`; // Join folder names with file name
              }

              // Remove any invalid characters (e.g., starting with a dot or empty names)
              importName = importName.replace(/^\.|[^a-zA-Z0-9_]/g, "");

              // Special case for handling specific names
              if (importName.startsWith("_")) {
                importName = importName.substring(1); // Remove leading underscore if present
              }

              names.push(importName);
              return `import ${importName} from '../${basePath}/${relativePath}';`;
            })
            .join("\n");

          await fs.writeFile(
            join(process.cwd(), outputFile),
            imports + `\nexport { ${names.join(", ")} };`
          );

          return imports;
        }

        // Scss
        async function generateImportsScss(dir, outputFile) {
          const files = await getAllScssFiles(dir);

          const names = [];
          const imports = files
            .map((file) => {
              const fileName = basename(file, ".scss");

              names.push(fileName);
              return `@import "${fileName}";`;
            })
            .join("\n");

          await fs.writeFile(join(process.cwd(), outputFile), imports);

          return imports;
        }

        // Initialize with current imports
        let currentComponentsImports = await generateImportsAndDeclarations(
          componentsDir,
          "src/types/components.d.ts",
          "components"
        );
        let currentUiImports = await generateImportsAndDeclarations(
          uiDir,
          "src/types/ui.d.ts",
          "ui"
        );

        let currentScssImports = await generateImportsScss(
          scssDir,
          "public/assets/scss/components/_index.scss"
        );

        updateConfig({
          vite: {
            plugins: [
              {
                name: "astro-auto-import-components",
                async handleHotUpdate({ file }) {
                  if (file.endsWith(".astro")) {
                    // Regenerate imports and declarations on file changes
                    await generateImportsAndDeclarations(
                      componentsDir,
                      "src/types/components.d.ts",
                      "components"
                    );
                    await generateImportsAndDeclarations(
                      uiDir,
                      "src/types/ui.d.ts",
                      "ui"
                    );
                    await generateImportsScss(
                      scssDir,
                      "public/assets/scss/components/_index.scss"
                    );
                  }
                },
              },
            ],
          },
        });
      },
    },
  };
}

export default astroAutoImportComponents;
