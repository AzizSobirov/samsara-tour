import { promises as fs } from "fs";
import { join } from "path";
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

        // Helper function to generate imports and declarations
        async function generateImportsAndDeclarations() {
          const files = await fs.readdir(componentsDir);
          const astroFiles = files.filter((file) => file.endsWith(".astro"));

          const imports = astroFiles
            .map((file) => {
              const componentName = file.replace(".astro", "");
              return `import ${componentName} from '../components/${file}';`;
            })
            .join("\n");

          // Generate a TypeScript declaration file
          // const declarations = astroFiles.map(file => {
          //   const componentName = file.replace('.astro', '');
          //   return `declare const ${componentName}: AstroComponent;`;
          // }).join('\n');

          // await fs.writeFile(join(process.cwd(), 'src/types/components.d.ts'), declarations);

          return imports;
        }

        // Initialize with current imports
        let currentImports = await generateImportsAndDeclarations();

        updateConfig({
          vite: {
            plugins: [
              {
                name: "astro-auto-import-components",
                async transform(code, id) {
                  if (id.endsWith(".astro")) {
                    // Regenerate imports and declarations on each build
                    currentImports = await generateImportsAndDeclarations();
                    return {
                      code: `${currentImports}\n${code}`,
                      map: null,
                    };
                  }
                },
                async handleHotUpdate({ file }) {
                  if (file.endsWith(".astro")) {
                    // Regenerate imports and declarations on file changes
                    await generateImportsAndDeclarations();
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

/* 
The use of this plugin has been temporarily suspended due to TypeScript issues.
25.07.2024 - Aziz Sobirov - azizdev.uz
*/
