import React, { useState, useCallback } from 'react';
import { redactText } from './services/geminiService';

const sampleText = `Patient Name: Johnathan Doe (DOB: 1985-04-12)
Address: 123 Maple Street, Anytown, USA 12345
Phone: 555-867-5309
Email: j.doe@example.com

On 2023-10-26, Mr. Doe visited Dr. Emily White at the General Hospital of Anytown for persistent headaches. An MRI was ordered (Ref: #GH-789-MRI). The results indicated mild inflammation. Dr. White prescribed Ibuprofen and advised a follow-up in two weeks. His insurance provider is HealthFirst Plus, policy number HF-987654321. He paid his co-pay with his Visa ending in 4321.`;

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);


const App: React.FC = () => {
    const [inputText, setInputText] = useState<string>(sampleText);
    const [redactedText, setRedactedText] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleRedactClick = useCallback(async () => {
        if (!inputText.trim()) {
            setError("Please enter some text to process.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setRedactedText('');

        try {
            const result = await redactText(inputText);
            setRedactedText(result);
        } catch (e: unknown) {
            const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
            setError(`Failed to process text: ${errorMessage}`);
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [inputText]);

    return (
        <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        PHI Redactor & Dateshifter
                    </h1>
                    <p className="mt-2 text-lg text-slate-400">
                        Automatically remove protected health information (PHI) and shift dates to protect privacy.
                    </p>
                </header>

                <main className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="flex flex-col space-y-4">
                        <label htmlFor="input-text" className="text-lg font-semibold text-slate-300">
                            Original Text
                        </label>
                        <textarea
                            id="input-text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="Paste or type the text you want to process here..."
                            className="w-full h-96 flex-grow p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleRedactClick}
                            disabled={isLoading || !inputText.trim()}
                            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 disabled:bg-slate-500 disabled:cursor-not-allowed transition-colors duration-200"
                        >
                            {isLoading ? (
                                <>
                                    <Spinner />
                                    Processing...
                                </>
                            ) : (
                                'Redact PHI & Shift Dates'
                            )}
                        </button>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <label htmlFor="output-text" className="text-lg font-semibold text-slate-300">
                            Processed Text
                        </label>
                        <div className="w-full h-96 flex-grow p-4 bg-slate-800 border border-slate-700 rounded-lg shadow-inner overflow-y-auto">
                             {error && (
                                <div className="flex items-center justify-center h-full">
                                <p className="text-red-400 text-center">{error}</p>
                                </div>
                            )}
                            {!error && !redactedText && !isLoading && (
                                <div className="flex items-center justify-center h-full">
                                <p className="text-slate-500">Your processed text will appear here.</p>
                                </div>
                            )}
                            {!error && isLoading && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="w-8 h-8 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
                                </div>
                            )}
                            <pre id="output-text" className="whitespace-pre-wrap text-slate-200 font-sans">{redactedText}</pre>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;