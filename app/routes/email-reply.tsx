import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";

export default function EmailReplyToolPage() {
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setResult(null);
        setLoading(true);

        const form = new FormData(e.currentTarget);

        const payload = {
            customerEmail: form.get("customerEmail"),
            tone: form.get("tone"),
            language: form.get("language"),
            companyInfo: form.get("companyInfo")
        };

        const response = await fetch("/api/tools/email-reply/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.error || "An error occurred");
        } else {
            setResult(`${data.result.subject}\n\n${data.result.body}`);
        }

        setLoading(false);
    }

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-8 bg-white text-slate-900">
            <h1 className="text-3xl font-bold">Email Reply Generator</h1>

            <Card className="bg-slate-100">
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-semibold">Customer Email</label>
                            <Textarea
                                name="customerEmail"
                                className="h-32"
                                placeholder="Paste the customer's email here..."
                            />
                        </div>

                        <div>
                            <label className="font-semibold">Tone</label>
                            <Select name="tone" defaultValue="professional">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="professional">Professional</SelectItem>
                                    <SelectItem value="friendly">Friendly</SelectItem>
                                    <SelectItem value="strict">Strict</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="font-semibold">Language</label>
                            <Select name="language" defaultValue="english">
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="english">English</SelectItem>
                                    <SelectItem value="swedish">Swedish</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="font-semibold">Company Info / FAQ (optional)</label>
                            <Textarea
                                name="companyInfo"
                                className="h-24"
                                placeholder="Return policy, support hours, policies, etc..." 
                            />
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Generating..." : "Generate Reply"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Error */}
            {error && (
                <Card className="border-red-300 bg-red-50 text-red-700">
                    <CardContent>{error}</CardContent>
                </Card>
            )}

            {/* Result */}
            {result && (
                <Card className="bg-slate-100">
                    <CardHeader>
                        <CardTitle>Generated Reply</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="whitespace-pre-wrap text-sm">{result}</div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}