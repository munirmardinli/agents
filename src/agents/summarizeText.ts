import { AgentDefinition } from "../agentDefinition.js";

class SummarizeText extends AgentDefinition {
  name = "zusammenfassen";
  slug = "zusammenfassen";
  fileName = "summarizeText";
  description = "Fasst eine angehängte PDF oder einen Fachtext sachlich zusammen.";
  disableModelInvocation = true;
  instructions = `Fasse das angehängte PDF-Dokument oder den markierten Fachtext sachlich, extrem prägnant und ohne Wiederholungen zusammen.

**Beachte dabei strikt folgende Regeln:**

- **Kürze & Präzision:** Fasse die Kernaussagen so kurz wie möglich zusammen ⇒ Vermeide Redundanzen und Doppelungen vollständig.
- **Zeilenangaben:** Ergänze bei jedem Stichpunkt die exakten Zeilenangaben aus dem Quelltext in Klammern am Ende des Punktes, z. B. <small style="color: var(--muted-foreground);">(Z. 10–15)</small> .
- **Aufzählungszeichen:** Nutze für alle Aufzählungen ausschließlich den Bindestrich (-).
- **Kausalzeichen:** Verwende das Zeichen ⇒ für Kausalzusammenhänge, Schlussfolgerungen, Praxisbezüge oder Ergebnisse.
- **Sprache:** Antworte ausnahmslos auf Deutsch.
- **Quellenbezug:** Stütze dich ausschließlich auf den bereitgestellten Text/PDF.`;
}

export { SummarizeText };
