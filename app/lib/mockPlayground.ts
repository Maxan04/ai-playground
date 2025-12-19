import type { Mode } from "./playgroundTypes";

export function mockPlayground(mode: Mode, input: string): string {
  const preview =
    input.trim().slice(0, 160) +
    (input.trim().length > 160 ? "..." : "");

  if (mode === "summary") {
    return `Summary (mock):\n${preview}\n\nDetta är en hårdkodad sammanfattning.`;
  }

  if (mode === "rewrite") {
    return `Rewrite (mock):\n${preview}\n\nTexten är nu “omskriven” på ett tydligare sätt (mock).`;
  }

  if (mode === "social") {
    return `Social Post (mock):\n${preview}\n\n🚀 Hårdkodad social post som låtsas vara optimerad för sociala medier.`;
  }

  if (mode === "campaign") {
    return `Campaign Info (mock):\n${preview}\n\nHårdkodad kampanjtext som låtsas vara anpassad för en Booiq-kampanj.`;
  }

  return `Unknown mode:\n${preview}`;
}