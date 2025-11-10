import React, { useState } from 'react';
import { BenchmarkResult, TestCategory } from '../types';
import ScoreGauge from './ScoreGauge';
import { downloadJson, copyMarkdownToClipboard } from '../utils/fileUtils';
import { DownloadIcon, CopyIcon } from './Icons';
import { CATEGORIES } from '../constants';

interface ResultsDisplayProps {
  results: BenchmarkResult;
}

const CategoryChip: React.FC<{ category: TestCategory | 'All'; isActive: boolean; onClick: () => void; }> = ({ category, isActive, onClick }) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-colors duration-200";
    const activeClasses = "bg-blue-600 text-white";
    const inactiveClasses = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600";
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {category}
        </button>
    );
};


const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
    const [activeCategory, setActiveCategory] = useState<TestCategory | 'All'>('All');
    const [copySuccess, setCopySuccess] = useState('');

    const handleDownload = () => {
        downloadJson(results, 'adshield-benchmark-results.json');
    };

    const handleCopy = () => {
        copyMarkdownToClipboard(results);
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    };

    const filteredBreakdown = activeCategory === 'All' 
        ? results.breakdown 
        : results.breakdown.filter(item => item.category === activeCategory);
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-around gap-8">
                <ScoreGauge score={results.score} />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4 text-center">
                    <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-green-500">{results.blocked}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Blocked</div>
                    </div>
                     <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-red-500">{results.loaded}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Loaded</div>
                    </div>
                     <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                        <div className="text-3xl font-bold text-slate-800 dark:text-white">{results.total}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <button onClick={handleDownload} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition">
                    <DownloadIcon className="w-5 h-5" /> Download JSON
                </button>
                 <button onClick={handleCopy} className="relative flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition">
                    <CopyIcon className="w-5 h-5" /> Copy Summary
                    {copySuccess && <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded">{copySuccess}</span>}
                </button>
            </div>

            <div>
                <h3 className="text-xl font-bold text-center mb-4 text-slate-900 dark:text-white">Detailed Results</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    <CategoryChip category="All" isActive={activeCategory === 'All'} onClick={() => setActiveCategory('All')} />
                    {CATEGORIES.map(cat => (
                        <CategoryChip key={cat} category={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
                    ))}
                </div>

                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 dark:bg-slate-700 text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3">Domain</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBreakdown.map((item, index) => (
                                <tr key={index} className="bg-white dark:bg-slate-800 border-b last:border-b-0 border-slate-200 dark:border-slate-700">
                                    <td className="px-6 py-4 font-mono font-medium text-slate-900 dark:text-white whitespace-nowrap">{item.domain}</td>
                                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.category}</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            item.status === 'blocked' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                                        }`}>
                                            {item.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
