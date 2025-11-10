import React, { useState, useCallback } from 'react';
import { TestRunStatus, BenchmarkResult, ResultBreakdown } from '../types';
import { runBenchmark } from '../services/benchmarkService';
import ResultsDisplay from './ResultsDisplay';
import { TEST_ENDPOINTS } from '../constants';

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
        <div className="bg-white dark:bg-slate-800/50 p-6 md:p-8 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
            {status === 'idle' && (
                <div className="text-center">
                    <button
                        onClick={handleRunTest}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
                    >
                        Run Benchmark Test
                    </button>
                </div>
            )}

            {status === 'running' && (
                <div>
                    <h2 className="text-2xl font-bold text-center mb-4 text-slate-900 dark:text-white">Test in Progress...</h2>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 mb-4 overflow-hidden">
                        <div 
                          className="bg-blue-500 h-4 rounded-full transition-all duration-300 ease-linear" 
                          style={{ width: `${(progress.length / TEST_ENDPOINTS.length) * 100}%` }}
                        ></div>
                    </div>
                    <p className="text-center text-slate-500 dark:text-slate-400">Testing domain {progress.length + 1} of {TEST_ENDPOINTS.length}...</p>
                    {progress.length > 0 && 
                        <p className="text-center font-mono text-sm mt-2 truncate">
                            {progress[progress.length-1].domain} - 
                            <span className={`${progress[progress.length-1].status === 'blocked' ? 'text-green-500' : 'text-red-500'}`}>
                                {progress[progress.length-1].status.toUpperCase()}
                            </span>
                        </p>
                    }
                </div>
            )}
            
            {status === 'finished' && results && (
                <div>
                    <ResultsDisplay results={results} />
                     <div className="text-center mt-8">
                        <button
                            onClick={handleRunTest}
                            className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-slate-300 dark:focus:ring-slate-800"
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
