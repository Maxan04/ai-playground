import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("/playground", "routes/playground.tsx"),
    route("/tools/marketing", "tools/marketing.tsx"),
] satisfies RouteConfig;
