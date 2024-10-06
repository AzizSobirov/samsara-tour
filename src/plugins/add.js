import { path, scssDir, componentDir, createFile } from "./helpers.js";

// Get the component name from command line arguments
const componentShortName = process.argv[2].toLowerCase();
const componentName = `The${process.argv[2].charAt(0).toUpperCase() + process.argv[2].slice(1)}`;

// Validate the component name
if (!componentName) {
  console.error("Error: Please provide a component name.");
  process.exit(1);
}

// Content templates for the files
const templates = {
  astro: `---
import { Section, H2 } from "@ui";
---

<Section name="${componentShortName}">
  <H2>${componentName}</H2>
</Section>
`,
  scss: `/* Styles for the ${componentName} component */
.${componentShortName} {
  // Styles 
}`,
};

// Main function to create the component
async function createComponent() {
  try {
    // Create astro, scss, and ts files
    await Promise.all([
      createFile(componentDir, `${componentName}.astro`, templates.astro),
      createFile(
        path.join(scssDir, "components"),
        `_${componentName}.scss`,
        templates.scss
      ),
    ]);

    console.log(
      `\x1b[32mComponent "${componentName}" created successfully.\x1b[0m`
    );
  } catch (error) {
    process.exit(1);
  }
}

createComponent();
