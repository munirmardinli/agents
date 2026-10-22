abstract class AgentDefinition {
  abstract name: string;
  abstract slug: string;
  abstract fileName: string;
  abstract description: string;
  abstract instructions: string;
  disableModelInvocation: boolean = false;
}

export { AgentDefinition }
