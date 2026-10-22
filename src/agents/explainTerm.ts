import { AgentDefinition } from "../agentDefinition.js";

class ExplainTerm extends AgentDefinition {
  name = "Erklären";
  slug = "erklaere";
  fileName = "explainTerm";
  description = "Erklärt einen Fachbegriff der Heilerziehungspflege verständlich.";
  disableModelInvocation = true;
  instructions = `Erkläre den folgenden Fachbegriff oder das Konzept verständlich und praxisnah für den HEP-Alltag.

**Beachte dabei:**

- Nutze für Aufzählungen ausschließlich \`-\`.
- Verwende \`⇒\` für Praxisbeispiele oder Schlussfolgerungen.
- Erläutere den Begriff fachlich korrekt (z. B. im Kontext von ICF, Partizipation oder Inklusion).`;
}

export { ExplainTerm };
