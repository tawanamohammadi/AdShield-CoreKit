
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import BenchmarkController from './components/BenchmarkController';
import ComparisonCard from './components/ComparisonCard';

const App: React.FC = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <div className="min-h-screen flex flex-col transition-colors duration-300">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                            AdShield CoreKit Benchmark
                        </h1>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Test your DNS ad-blocker's effectiveness by attempting to contact known ad and tracker domains directly from your browser.
                        </p>
                    </div>
                    
                    <BenchmarkController />

                    <ComparisonCard />

                    <div className="mt-12 p-6 bg-white dark:bg-slate-800/50 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">How It Works & Limitations</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-2">
                            This tool sends network requests (using JavaScript's <code>fetch</code> API) to a list of domains known for serving ads and tracking users.
                        </p>
                        <ul className="list-disc list-inside space-y-2 text-slate-600 dark:text-slate-400">
                            <li>If a request fails to complete (due to a network error, DNS resolution failure, or timeout), we mark the domain as <span className="font-semibold text-green-600 dark:text-green-400">BLOCKED</span>.</li>
                            <li>If a request succeeds, we mark it as <span className="font-semibold text-red-600 dark:text-red-400">LOADED</span>.</li>
                            <li>The final score is a weighted percentage of blocked domains. Video ad domains are weighted higher as they are often more intrusive.</li>
                            <li><strong>Caveat:</strong> Browser-based tests are heuristic. Due to security policies like CORS, a "loaded" result doesn't mean the content was displayed, only that the network request was not blocked at the DNS level. The CLI benchmark is more authoritative for server-side validation.</li>
                        </ul>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
};

export default App;
