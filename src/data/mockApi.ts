import type { SupportAgent, SupportCase } from "@/types/supportCase";
import dbCases from "./db.json";
import { agents } from "./agents";

const cases: SupportCase[] = (dbCases as unknown[]).map((raw) => {
  const r = raw as Record<string, unknown>;
  return {
    ...r,
    createdAt: new Date(r.createdAt as string),
    updatedAt: new Date(r.updatedAt as string),
    deadline: new Date(r.deadline as string),
  } as SupportCase;
});

const LATENCY_MS = 1200;

function waitForMockApi(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, LATENCY_MS);
  });
}

export async function fetchCases(): Promise<SupportCase[]> {
  await waitForMockApi();
  return cases;
}

export async function fetchAgents(): Promise<SupportAgent[]> {
  await waitForMockApi();
  return agents;
}

export async function assignAgent(
  caseId: string,
  agentId: string,
): Promise<SupportCase> {
  await waitForMockApi();

  const targetCase = cases.find((c) => c.id === caseId);

  if (!targetCase) {
    throw new Error(`Case ${caseId} not found`);
  }

  const agent = agents.find((a) => a.id === agentId);

  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  if (targetCase.status !== "open") {
    throw new Error(`Cannot assign agent to a ${targetCase.status} case`);
  }

  if (agent.specialty !== targetCase.category) {
    throw new Error(
      `Agent specialty ${agent.specialty} does not match case category ${targetCase.category}`,
    );
  }

  targetCase.agentId = agentId;
  targetCase.status = "in-progress";

  return targetCase;
}
