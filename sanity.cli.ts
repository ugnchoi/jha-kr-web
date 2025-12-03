import { defineCliConfig } from "sanity/cli";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID for Sanity CLI.");
}

export default defineCliConfig({
  api: { projectId, dataset },
  deployment: {
    appId: "gk1qeu4oxuekmerv3euwfwps",
  },
});

