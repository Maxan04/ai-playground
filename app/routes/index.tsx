import { Link } from "react-router";
import { tools } from "../tools/config";

export default function LandingPage() {
  return (
    <div className="p-2 md:p-8 text-slate-900 bg-white">
      <h1 className="text-3xl font-bold mb-4">Welcome</h1>
      <p>Välj ett verktyg för att komma igång:</p>

      <div className="flex gap-4 mt-4">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            to={tool.path}
            className="border p-4 no-underline w-64 rounded bg-slate-100 hover:shadow-lg hover:border-blue-500"
          >
            <h3 className="text-lg font-semibold">{tool.name}</h3>
            <p className="text-sm">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
