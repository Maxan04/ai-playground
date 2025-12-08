import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("/playground", "routes/playground.tsx"),
    route("/tools/marketing", "routes/marketing.tsx"),
    route("/api/tools/marketing/generate", "routes/api.tools.marketing.generate.ts"),
] satisfies RouteConfig;
