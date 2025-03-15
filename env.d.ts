// types/env.d.ts or just env.d.ts at the project root

declare module "bun" {
    interface Env {
      // Add your environment variables here with their types
      API_KEY: string;
      API_BASE_URL: string;
      // Add as many as you need
    }
  }