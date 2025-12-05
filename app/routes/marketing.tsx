import { Form, useActionData } from "react-router";

export async function action({ request }: { request: Request }) {
    const form = await request.formData();

    return {
        output: "Här kommer resultatet..."
    };
}

export default function MarketingToolPage() {
    const result = useActionData();

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold mb-4">Marketing Content Generator</h1>

            <Form method="post" className="space-y-4 border p-4 rounded shadow">
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
                    <p>Settings</p>
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
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Generate
                </button>
            </Form>

            {result && (
                <div className="border p-4 rounded shadow bg-gray-100 text-gray-900">
                    <h2 className="text-2xl font-semibold mb-2">Resultat</h2>
                    <p>{result.output}</p>
                </div>
            )}
        </div>
    );
}
