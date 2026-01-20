import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Textarea } from "~/components/ui/textarea";

export default function MarketingToolPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);
    const [creativity, setCreativity] = useState<number>(1);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResult(null);

        const form = new FormData(e.currentTarget);

        const payload = {
            sourceContent: form.get("sourceContent"),
            deliveryType: form.get("deliveryType"),
            extraInstructions: form.get("extraInstructions"),
            tone: form.get("tone"),
            length: form.get("length"),
            language: form.get("language"),
            creativity,
        };
        
        const res = await fetch("/api/tools/marketing/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "An error occurred");
        } else {
            setResult(data.result);
        }
        setLoading(false);
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 bg-white text-slate-900">
            <h1 className="text-3xl font-bold mb-4">Marketing Content Generator</h1>

            <Card className="bg-slate-100">
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="font-semibold">Source Content</label>
                            <Textarea name="sourceContent" className="h-32" />
                        </div>

                        <div>
                            <label className="font-semibold">Delivery Type</label>

                            <Select name="deliveryType">
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose delivery type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="email">Email</SelectItem>
                                    <SelectItem value="ad">Ad</SelectItem>
                                    <SelectItem value="social">Social Media Post</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <label className="font-semibold">Extra Instructions</label>
                            <Textarea name="extraInstructions" className="h-24" />
                        </div>

                        <div className="space-y-4">
                            <p className="font-semibold">Settings</p>

                            <div>
                                <label>Tone:</label>
                                <Select name="tone">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose tone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="neutral">Neutral</SelectItem>
                                        <SelectItem value="friendly">Friendly</SelectItem>
                                        <SelectItem value="formal">Formal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label>Length:</label>
                                <Select name="length">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose length" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="short">Short</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="long">Long</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label>Language:</label>
                                <Select name="language">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sv">Swedish</SelectItem>
                                        <SelectItem value="en">English</SelectItem>
                                    </SelectContent>
                                </Select>            
                            </div>

                            <div>
                                <label>Creativity:</label>
                                <Slider 
                                    value={[creativity * 50]}
                                    max={100}
                                    min={0}
                                    step={1}
                                    onValueChange={([value]) => {
                                        setCreativity(Number((value / 50).toFixed(2)));
                                    }}
                                />
                                <span className="mt-1">{creativity}</span>
                            </div>
                        </div>

                        <Button type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Generate"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {error && (
                <Card className="border-red-300 bg-red-50 text-red-700">
                    <CardContent>{error}</CardContent>
                </Card>
            )}

            {result && (
                <Card className="bg-slate-100">
                    <CardContent>
                        <h2 className="text-2xl font-semibold mb-2">Result</h2>
                        
                        <div className="whitespace-pre-wrap">{result}</div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
