import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import { createPromptProcedure } from "./routes/prompts/create/route";
import { listPromptsProcedure } from "./routes/prompts/list/route";
import { updatePromptProcedure } from "./routes/prompts/update/route";
import { deletePromptProcedure } from "./routes/prompts/delete/route";
import { optimizePromptProcedure } from "./routes/ai/optimize/route";
import { analyzePromptProcedure } from "./routes/ai/analyze/route";
import { generatePromptProcedure } from "./routes/ai/generate/route";
import { listTemplatesProcedure } from "./routes/templates/list/route";
import { usageAnalyticsProcedure } from "./routes/analytics/usage/route";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  prompts: createTRPCRouter({
    create: createPromptProcedure,
    list: listPromptsProcedure,
    update: updatePromptProcedure,
    delete: deletePromptProcedure,
  }),
  ai: createTRPCRouter({
    optimize: optimizePromptProcedure,
    analyze: analyzePromptProcedure,
    generate: generatePromptProcedure,
  }),
  templates: createTRPCRouter({
    list: listTemplatesProcedure,
  }),
  analytics: createTRPCRouter({
    usage: usageAnalyticsProcedure,
  }),
});

export type AppRouter = typeof appRouter;