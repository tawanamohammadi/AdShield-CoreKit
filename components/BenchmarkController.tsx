import React, { useState, useCallback } from 'react';
import { TestRunStatus, BenchmarkResult, ResultBreakdown } from '../types.ts';
import { runBenchmark } from '../services/benchmarkService.ts';
import ResultsDisplay from './ResultsDisplay.tsx';
import { TEST_ENDPOINTS } from '../constants.ts';

const BenchmarkController: React.FC = () => {
    const [status, setStatus] = useState<TestRunStatus>('idle');
    const [results, setResults] = useState<BenchmarkResult | null>(null);
    const [progress, setProgress] = useState<ResultBreakdown[]>([]);

    const handleRunTest = useCallback(async () => {
        setStatus('running');
        setResults(null);
        setProgress([]);

        const onProgressUpdate = (update: ResultBreakdown) => {
            setProgress(prev => [...prev, update]);
        };
        
        try {
            const finalResults = await runBenchmark(onProgressUpdate);
            setResults(finalResults);
        } catch (error) {
            console.error("Benchmark failed:", error);
            // Optionally set an error state here
        } finally {
            setStatus('finished');
        }
    }, []);
    
    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700/50">
            {status === 'idle' && (
                <div className="text-center">
                    <button
                        onClick={handleRunTest}
                        className="bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg hover:shadow-blue-500/50"
                    >
                        Run Benchmark Test
                    </button>
                </div>
            )}

            {status === 'running' && (
                <div>
                    <h2 className="text-2xl font-bold text-center mb-4 text-slate-900 dark:text-white">Test in Progress...</h2>
                    <div className="relative w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-2 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-sky-400 h-4 rounded-full transition-all duration-300 ease-linear" 
                          style={{ width: `${(progress.length / TEST_ENDPOINTS.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mb-4">Testing domain {progress.length} of {TEST_ENDPOINTS.length}</p>
                    {progress.length > 0 && 
                        <div className="text-center p-3 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                            <p className="font-mono text-sm text-slate-600 dark:text-slate-300 truncate">
                                {progress[progress.length-1].domain} {'->'}
                                <span className={`font-bold ml-2 ${progress[progress.length-1].status === 'blocked' ? 'text-green-500' : 'text-red-500'}`}>
                                    {progress[progress.length-1].status.toUpperCase()}
                                </span>
                            </p>
                        </div>
                    }
                </div>
            )}
            
            {status === 'finished' && results && (
                <div>
                    <ResultsDisplay results={results} />
                     <div className="text-center mt-10">
                        <button
                            onClick={handleRunTest}
                            className="bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-800"
                        >
                            Run Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BenchmarkController;