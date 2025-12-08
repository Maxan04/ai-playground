import { useState } from "react";

export default function MarketingToolPage() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<string | null>(null);

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
            creativity: form.get("creativity"),
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
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-4">Marketing Content Generator</h1>

            <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow">
                <div>
                    <label>Source Content:</label>
                    <textarea name="sourceContent" className="border p-2 w-full h-32" />
                </div>

                <div>
                    <label>Delivery Type</label>
                    <select name="deliveryType" className="border p-2 w-full text-gray-900 bg-white">
                        <option value="email">Email</option>
                        <option value="ad">Ad</option>
                        <option value="social">Social Media Post</option>
                    </select>
                </div>

                <div>
                    <label>Extra Instructions:</label>
                    <textarea name="extraInstructions" className="border p-2 w-full h-24" />
                </div>

                <div className="flex flex-col gap-2">
                    <p className="font-semibold">Settings</p>

                    <div>
                        <label>Tone:</label>
                        <select name="tone" className="border p-2 w-full text-gray-900 bg-white">
                            <option value="neutral">Neutral</option>
                            <option value="friendly">Friendly</option>
                            <option value="formal">Formal</option>
                        </select>
                    </div>

                    <div>
                        <label>Length:</label>
                        <select name="length" className="border p-2 w-full text-gray-900 bg-white">
                            <option value="short">Short</option>
                            <option value="medium">Medium</option>
                            <option value="long">Long</option>
                        </select>                
                    </div>

                    <div>
                        <label>Language:</label>
                        <select name="language" className="border p-2 w-full text-gray-900 bg-white">
                            <option value="sv">Swedish</option>
                            <option value="en">English</option>
                        </select>            
                    </div>

                    <div>
                        <label>Creativity:</label>
                        <input  type="range"
                                name="creativity"
                                min="0" 
                                max="100" 
                                defaultValue="50"
                                className="w-full"
                                onChange={(e) => {
                                    const value = e.target.value;
                                    const display = document.getElementById("creativityValue");
                                    if (display) {
                                        display.textContent = value;
                                    }
                                }}
                        />
                        <span id="creativityValue">50</span>
                    </div>
                </div>

                <button type="submit"
                        disabled={loading}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    {loading ? "Loading..." : "Generate"}
                </button>
            </form>

            {error && (
                <div className="text-red-600 font-semibold">
                    {error}
                </div>
            )}

            {result && (
                <div className="border p-4 rounded shadow bg-gray-100 text-gray-900">
                    <h2 className="text-2xl font-semibold mb-2">Resultat</h2>
                    <p>{result}</p>
                </div>
            )}
        </div>
    );
}
