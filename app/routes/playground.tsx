import { useLoaderData, Form, redirect, type ActionFunctionArgs } from "react-router";
import { db } from "../../src/db/db";
import { experiments } from "../../src/db/schema";
import { desc } from "drizzle-orm";
import { mockPlayground } from "~/lib/mockPlayground";

type LoaderData = {
    experiments: Array<{
    id: number;
    createdAt: number;
    mode: string;
    inputText: string;
    outputText: string;
    label?: string;
  }>;
};

// Loader
export async function loader() {
    const rows = await db
        .select()
        .from(experiments)
        .orderBy(desc(experiments.createdAt))
        .limit(20);

    return { experiments: rows };
}

// Action
export async function action({ request }: ActionFunctionArgs) {
    const form = await request.formData();
    const mode = form.get("mode") as string;
    const inputText = form.get("inputText") as string;

    const outputText = mockPlayground(mode, inputText);

    await db.insert(experiments).values({
        mode,
        inputText,
        outputText,
        createdAt: new Date(),
    });

    return redirect("/playground")
}

// Komponent
export default function PlaygroundRoute() {
    const { experiments } = useLoaderData<LoaderData>();

    const latest = experiments[0];

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-100">Playground</h1>

            {/* FORMULÄR */}
            <Form method="post" className="space-y-4 border p-4 rounded shadow bg-white">
                <div>
                    <label className="block mb-1 font-semibold text-gray-800">Mode</label>
                    <select name="mode" className="border p-2 rounded w-full text-gray-900 bg-white">
                        <option value="summary">summary</option>
                        <option value="rewrite">rewrite</option>
                        <option value="social">social</option>
                        <option value="campaign">campaign</option>
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold text-gray-800">Input Text</label>
                    <textarea
                        name="inputText"
                        rows={5}
                        className="border p-2 rounded w-full text-gray-900 bg-white"
                    />
                </div>

                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Run
                </button>
            </Form>

            {/* SENASTE KÖRNING */}
            {latest && (
                <div className="border p-4 rounded bg-gray-100 shadow text-gray-900">
                    <h2 className="text-xl font-semibold mb-2">Senaste körningen</h2>
                    <p>
                        <span className="font-semibold">Mode:</span> {latest.mode}
                    </p>
                    <p>
                        <span className="font-semibold">Input:</span>{" "}
                        {latest.inputText}
                    </p>
                    <p>
                        <span className="font-semibold">Output:</span>{" "}
                        {latest.outputText}
                    </p>
                    <p className="text-sm text-gray-600">
                        {new Date(latest.createdAt).toLocaleString()}
                    </p>
                </div>
            )}

            {/* LISTA ÖVER TIDIGARE KÖRNINGAR */}
            <div className="space-y-2">
                <h2 className="text-xl font-semibold mb-2 text-gray-100">Tidigare körningar</h2>
                {experiments.slice(1).map((exp) => (
                    <div
                        key={exp.id}
                        className="border p-2 rounded bg-gray-50 flex justify-between items-center text-gray-900"
                    >
                        <div className="flex flex-col">
                            <span className="font-semibold">{exp.mode}</span>
                            <span className="text-gray-700 text-sm">
                                {exp.inputText.slice(0, 50)}...
                            </span>
                            <span className="text-gray-600 text-xs">
                                {new Date(exp.createdAt).toLocaleString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
