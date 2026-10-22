import path from "node:path";
import { fileURLToPath } from "node:url";

import { rm, mkdir, writeFile } from "node:fs/promises";
import { AgentDefinition } from "./agentDefinition.js";
import { ExplainTerm } from "./agents/explainTerm.js";
import { HepTextExplainer } from "./agents/hepTextExplainer.js";
import { HepFlashcards } from "./agents/hepFlashcards.js";
import { Presentation } from "./agents/presentation.js";
import { SummarizeText } from "./agents/summarizeText.js";

class AgentGenerator {
  private root: string;
  private targets: {
    directory: string;
    extension: string;
    platform: "claude" | "vscode" | "cursor" | "gemini";
  }[] = [
      { directory: ".claude/agents", extension: ".md", platform: "claude" },
      { directory: ".github/agents", extension: ".agent.md", platform: "vscode" },
      { directory: ".cursor/agents", extension: ".md", platform: "cursor" },
      { directory: ".gemini/agents", extension: ".md", platform: "gemini" },
    ];
  private definitions: AgentDefinition[] = [
    new HepTextExplainer(),
    new Presentation(),
    new HepFlashcards(),
    new ExplainTerm(),
    new SummarizeText(),
  ];

  constructor() {
    this.root = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
    );
  }
  private renderAgent(
    target: {
      directory: string;
      extension: string;
      platform: "claude" | "vscode" | "cursor" | "gemini";
    },
    definition: AgentDefinition,
  ): string {
    let frontmatter: string[];
    if (target.platform === "vscode") {
      frontmatter = [
        `name: ${definition.name}`,
        `description: ${definition.description}`,
      ];
      if (definition.disableModelInvocation) {
        frontmatter.push("disable-model-invocation: true");
      }
    } else {
      frontmatter = [
        `name: ${definition.slug}`,
        `description: ${JSON.stringify(definition.description)}`,
      ];
    }

    return [
      "---",
      ...frontmatter,
      "---",
      "",
      definition.instructions,
      "",
    ].join("\n");
  }

  async run(): Promise<void> {
    let seenSlugs: string[] = [];
    let generatedCount = 0;

    for (let definitionIndex = 0; definitionIndex < this.definitions.length; definitionIndex += 1) {
      let definition = this.definitions[definitionIndex];
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(definition.slug)) {
        throw new Error(
          `Ungültiger Agent-Slug "${definition.slug}". Erlaubt sind Kleinbuchstaben, Zahlen und Bindestriche.`,
        );
      }
      if (!/^[a-z][A-Za-z0-9]*$/.test(definition.fileName)) {
        throw new Error(
          `Ungültiger Ausgabedateiname "${definition.fileName}". Verwende englisches camelCase ohne Erweiterung.`,
        );
      }
      if (seenSlugs.includes(definition.slug)) {
        throw new Error(`Der Agent-Slug "${definition.slug}" ist mehrfach vergeben.`);
      }
      seenSlugs.push(definition.slug);

      for (let targetIndex = 0; targetIndex < this.targets.length; targetIndex += 1) {
        let target = this.targets[targetIndex];
        let destination = path.join(
          this.root,
          target.directory,
          `${definition.fileName}${target.extension}`,
        );
        let legacyDestination = path.join(
          this.root,
          target.directory,
          `${definition.slug}${target.extension}`,
        );
        if (legacyDestination !== destination) {
          await rm(legacyDestination, { force: true });
        }
        await mkdir(path.dirname(destination), { recursive: true });
        await writeFile(destination, this.renderAgent(target, definition));
        generatedCount += 1;
        console.log(`Generated ${path.relative(this.root, destination)}`);
      }
    }

    console.log(
      `Generated ${generatedCount} agent files from ${this.definitions.length} TypeScript classes.`,
    );
  }
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  await new AgentGenerator().run();
}
