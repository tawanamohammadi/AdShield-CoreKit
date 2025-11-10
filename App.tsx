import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import BenchmarkController from './components/BenchmarkController.tsx';
import ComparisonCard from './components/ComparisonCard.tsx';

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
        <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-gray-950 transition-colors duration-300">
            <Header theme={theme} toggleTheme={toggleTheme} />
            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400 dark:from-blue-400 dark:to-sky-300 leading-tight pb-2">
                            AdShield CoreKit Benchmark
                        </h1>
                        <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            Test your DNS ad-blocker's effectiveness by attempting to contact known ad and tracker domains directly from your browser.
                        </p>
                    </div>
                    
                    <BenchmarkController />

                    <ComparisonCard />

                    <div className="mt-16 p-6 bg-white dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700/50">
                        <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">How It Works & Limitations</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-4">
                            This tool sends network requests (using JavaScript's <code>fetch</code> API) to a list of domains known for serving ads and tracking users.
                        </p>
                        <ul className="list-disc list-inside space-y-3 text-slate-600 dark:text-slate-400">
                            <li>If a request fails (due to a network error, DNS resolution failure, or timeout), we mark the domain as <span className="font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 px-1.5 py-0.5 rounded-md">BLOCKED</span>.</li>
                            <li>If a request succeeds, we mark it as <span className="font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded-md">LOADED</span>.</li>
                            <li>The final score is a weighted percentage of blocked domains. Video and audio ad domains are weighted higher as they are often more intrusive.</li>
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