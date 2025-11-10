import React, { useState } from 'react';
import { BenchmarkResult } from '../types';

const ComparisonCard: React.FC = () => {
    const [serverJson, setServerJson] = useState('');
    const [serverResult, setServerResult] = useState<BenchmarkResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handlePaste = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = event.target.value;
        setServerJson(text);
        if (text.trim() === '') {
            setServerResult(null);
            setError(null);
            return;
        }
        try {
            const parsed = JSON.parse(text);
            // Basic validation
            if (typeof parsed.score !== 'number' || typeof parsed.blocked !== 'number') {
                throw new Error('Invalid JSON format for benchmark results.');
            }
            setServerResult(parsed);
            setError(null);
        } catch (e) {
            setServerResult(null);
            setError('Invalid JSON. Please paste the content of results.json from the CLI tool.');
        }
    };

    return (
        <div className="mt-12 p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50">
            <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">Compare Server vs. Browser Results</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
                Run <code>bash test/run_benchmark.sh</code> on your server, then paste the contents of <code>test/results.json</code> below to compare.
            </p>
            <div className="grid md:grid-cols-2 gap-6 items-start">
                <div>
                    <textarea
                        value={serverJson}
                        onChange={handlePaste}
                        placeholder="Paste your server's results.json here..."
                        className="w-full h-48 p-3 font-mono text-sm bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:placeholder-slate-500"
                        aria-label="Server JSON input"
                    />
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <div className="bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg h-full">
                    {serverResult ? (
                        <div className="space-y-3">
                            <h4 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Server-Side Results</h4>
                            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-700 pb-2">
                                <span className="text-slate-500 dark:text-slate-400">Score</span>
                                <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{serverResult.score}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-slate-500 dark:text-slate-400">Blocked</span>
                                <span className="font-semibold text-green-600 dark:text-green-400">{serverResult.blocked}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-slate-500 dark:text-slate-400">Loaded</span>
                                <span className="font-semibold text-red-600 dark:text-red-400">{serverResult.loaded}</span>
                            </div>
                             <div className="flex justify-between items-center">
                                <span className="text-slate-500 dark:text-slate-400">Total</span>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">{serverResult.total}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-md text-slate-500 dark:text-slate-400 text-sm">
                            Awaiting valid JSON...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComparisonCard;
