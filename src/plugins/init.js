import inquirer from "inquirer";
import { path, fsExtra, assetsDir, resourcesDir } from "./helpers.js";

async function initProject() {
  const data = {
    libs: [],
    language: null,
    gsapLibs: [], // To hold GSAP library choices
  };

  const libChoices = [
    {
      name: "Swiper (Slider)",
      shortname: "swiper",
      value: ["swiper.min.css", "swiper.min.js"],
    },
    {
      name: "Fancybox (LightBox)",
      shortname: "fancybox",
      value: ["fancybox.min.css", "fancybox.min.js"],
    },
    {
      name: "AOS (Animate On Scroll)",
      shortname: "aos",
      value: ["aos.min.css", "aos.min.js"],
    },
    {
      name: "GSAP (Animation)",
      shortname: "gsap",
      value: ["gsap.min.js"],
    },
    {
      name: "Yandex Map",
      shortname: "yandex-map",
      value: ["yandexmap.min.js"],
    },
  ];

  const gsapChoices = [
    { name: "ScrollSmoother", value: ["ScrollSmoother.min.js"] },
    { name: "MouseFollower", value: ["MouseFollower.min.js"] },
    { name: "ScrollTriger", value: ["ScrollTriger.min.js"] },
    { name: "None", value: "none" },
  ];

  // Handle SIGINT (Ctrl+C) for graceful shutdown
  const handleExit = () => {
    console.log("\nProcess interrupted. Exiting...");
    process.exit();
  };

  process.on("SIGINT", handleExit);

  try {
    // Prompt the user to select libraries
    if (!data.libs.length) {
      const prompt1 = await inquirer.prompt([
        {
          type: "checkbox",
          name: "lib",
          message: "Which library do you want to init?",
          choices: libChoices,
          validate(value) {
            if (value.length < 1) {
              return "You must choose at least one feature.";
            }
            return true;
          },
        },
      ]);

      data.libs = prompt1.lib;
    }

    // Check if GSAP is selected
    if (data.libs.join(", ").includes("gsap.min.js")) {
      const gsapPrompt = await inquirer.prompt([
        {
          type: "checkbox",
          name: "lib",
          message: "Select GSAP libraries to include:",
          choices: gsapChoices,
          validate(value) {
            if (value.length < 1) {
              return "You must choose at least one feature.";
            }
            return true;
          },
        },
      ]);

      if (!gsapPrompt.lib.join(", ").includes("none")) {
        data.gsapLibs = gsapPrompt.lib;
      }
    }

    // Copy
    const copyFiles = async (lib) => {
      for (const file of lib) {
        const ext = path.extname(file).slice(1);
        try {
          await fsExtra.copy(
            path.join(resourcesDir, ext, file),
            path.join(assetsDir, ext, file)
          );
        } catch (error) {
          console.error(`Error copying file ${file}:`, error);
        }
      }
    };

    // Copy files for each selected library
    for (const lib of data.libs) {
      await copyFiles(lib);
    }

    // Copy GSAP libraries if any
    for (const lib of data.gsapLibs) {
      await copyFiles(lib);
    }

    console.log("Libraries initialized and files copied.");
  } catch (error) {
    if (error.isTtyError) {
      console.error("Prompt couldn't be rendered in the current environment.");
    } else {
      console.error("Canceled");
    }
  } finally {
    // Remove the SIGINT handler to prevent unnecessary messages
    process.off("SIGINT", handleExit);
  }
}

initProject();
