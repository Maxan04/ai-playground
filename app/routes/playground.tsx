import { useLoaderData, Form, redirect, type ActionFunctionArgs, useActionData } from "react-router";
import { db } from "../../src/db/db";
import { experiments } from "../../src/db/schema";
import { desc } from "drizzle-orm";
import { mockPlayground } from "~/lib/mockPlayground";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

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
    const allowedModes = ["summary", "rewrite", "social", "campaign"] as const;

    const form = await request.formData();
    const mode = String(form.get("mode") || "");
    const inputText = String(form.get("inputText") || "");

    if (!allowedModes.includes(mode as any) || inputText.trim().length === 0) {
        return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    const outputText = mockPlayground(mode, inputText);

    await db.insert(experiments).values({
        createdAt: Date.now(),
        mode,
        inputText,
        outputText,
    });

    return redirect("/playground")
}

// Komponent
export default function PlaygroundRoute() {
    const { experiments } = useLoaderData<LoaderData>();
    const latest = experiments[0];
    const actionData = useActionData() as { error?: string } | undefined;

    if (experiments.length === 0) {
        return (
            <div className="p-8 max-w-4xl mx-auto bg-white text-slate-900 space-y-8">
                <h1 className="text-3xl font-bold">Playground</h1>

                {/* FORMULÄR */}
                <Card className="bg-slate-100">
                    <CardContent>
                        <Form method="post" className="space-y-4">

                            <div className="space-y-2">
                                <label className="font-semibold">Mode</label>
                                <Select name="mode">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Välj mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="summary">summary</SelectItem>
                                        <SelectItem value="rewrite">rewrite</SelectItem>
                                        <SelectItem value="social">social</SelectItem>
                                        <SelectItem value="campaign">campaign</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="font-semibold">Input Text</label>
                                <Textarea name="inputText" rows={5} />
                            </div>

                            <Button>Run</Button>
                        </Form>
                    </CardContent>
                </Card>

                {/* FELMEDDELANDE */}
                {actionData?.error && (
                    <Card className="border-red-300 bg-red-50 text-red-700">
                        <CardContent>
                            {actionData.error}
                        </CardContent>
                    </Card>
                )}

                <Card className="border-dashed border-2 border-slate-300 bg-slate-50">
                    <CardContent>
                        Inga körningar ännu. Skriv in text och klicka Run för att skapa din första körning.
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto bg-white text-slate-900 space-y-8">
            <h1 className="text-3xl font-bold">Playground</h1>

            {/* FORMULÄR */}
            <Card className="bg-slate-100">
                <CardContent>
                    <Form method="post" className="space-y-4">

                        <div className="space-y-2">
                            <label className="font-semibold">Mode</label>
                            <Select name="mode">
                                <SelectTrigger>
                                    <SelectValue placeholder="Välj mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="summary">summary</SelectItem>
                                    <SelectItem value="rewrite">rewrite</SelectItem>
                                    <SelectItem value="social">social</SelectItem>
                                    <SelectItem value="campaign">campaign</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="font-semibold">Input Text</label>
                            <Textarea name="inputText" rows={5} />
                        </div>

                        <Button>Run</Button>
                    </Form>
                </CardContent>
            </Card>

            {/* FELMEDDELANDE */}
            {actionData?.error && (
                <Card className="border-red-300 bg-red-50 text-red-700">
                    <CardContent>
                        {actionData.error}
                    </CardContent>
                </Card>
            )}

            {/* SENASTE KÖRNING */}
            {latest && (
                <Card className="bg-slate-100">
                    <CardHeader>
                        <CardTitle>Senaste körningen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p><strong>Mode:</strong> {latest.mode}</p>
                        <p><strong>Input:</strong> {latest.inputText}</p>
                        <p><strong>Output:</strong> {latest.outputText}</p>
                        <p className="text-sm text-slate-500">
                            {new Date(latest.createdAt).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* LISTA ÖVER TIDIGARE KÖRNINGAR */}
            {experiments.length > 1 && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Tidigare körningar</h2>

                    <div className="space-y-3">
                        {experiments.slice(1).map((exp) => (
                            <Card key={exp.id} className="bg-slate-100">
                                <CardContent className="p-3 space-y-1">
                                    <strong>{exp.mode}</strong>
                                    <p className="text-sm text-slate-700">
                                        {exp.inputText.slice(0, 50)}...
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {new Date(exp.createdAt).toLocaleString()}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
