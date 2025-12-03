export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-12-03";

export const dataset = getEnvVar(
  "NEXT_PUBLIC_SANITY_DATASET",
  "production" // Default dataset so builds don't fail before envs are set in Vercel
);

export const projectId = getEnvVar(
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "lwvgcasl"
);

function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

