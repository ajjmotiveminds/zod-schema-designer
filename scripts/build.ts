import { readFile, writeFile } from "fs/promises";
import { z } from "zod";
import { registryEntrySchema } from "./schema.js";
import { glob } from "glob";

async function buildRegistry() {
  console.log("Building registry...");

  const registry: z.infer<typeof registryEntrySchema> = {
    name: "zod-schema-designer",
    type: "registry:ui",
    registryDependencies: [
      "badge",
      "button",
      "dialog",
      "input",
      "label",
      "select",
      "separator",
      "switch",
      "tooltip"
    ],
    dependencies: [
      "zod",
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-label",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-switch",
      "@radix-ui/react-tooltip"
    ],
    devDependencies: [],
    tailwind: {
      config: {},
    },
    cssVars: {},
    files: [],
  };

  const srcRegistry = structuredClone(registry);

  const files = await glob(`./components/zod-schema-designer/**/*`, { nodir: true });
  for (const file of files) {
    const content = await readFile(file, "utf-8");
    registry.files!.push({
      path: file.replace("components/zod-schema-designer/", ""),
      target: file,
      content,
      type: "registry:ui",
    });
    srcRegistry.files!.push({
      path: file.replace("components/zod-schema-designer/", ""),
      target: "src/" + file,
      content,
      type: "registry:ui",
    });
  }

  await writeFile("./registry/zod-schema-designer.json", JSON.stringify(registry, null, 2));
  await writeFile(
    "./registry/zod-schema-designer-src.json",
    JSON.stringify(srcRegistry, null, 2)
  );

  console.log("Registry built!");
}

buildRegistry().catch(console.error);