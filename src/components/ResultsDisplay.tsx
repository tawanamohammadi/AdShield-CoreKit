import React, { useState } from 'react';
import { BenchmarkResult, TestCategory } from '../types';
import ScoreGauge from './ScoreGauge';
import { downloadJson, copyMarkdownToClipboard } from '../utils/fileUtils';
import { DownloadIcon, CopyIcon, CheckCircleIcon, XCircleIcon, Bars3BottomLeftIcon } from './Icons';
import { CATEGORIES } from '../constants';

interface ResultsDisplayProps {
  results: BenchmarkResult;
}

const CategoryChip: React.FC<{ category: TestCategory | 'All'; isActive: boolean; onClick: () => void; }> = ({ category, isActive, onClick }) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-full cursor-pointer transition-all duration-200 transform hover:scale-105";
    const activeClasses = "bg-blue-600 text-white shadow-md";
    const inactiveClasses = "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600";
    return (
        <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
            {category}
        </button>
    );
};

const StatCard: React.FC<{icon: React.ReactNode, value: number, label: string, color: string}> = ({icon, value, label, color}) => (
    <div className="flex items-center p-4 bg-slate-100 dark:bg-slate-700/50 rounded-xl space-x-4">
        <div className={`p-2 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <div className="text-3xl font-bold text-slate-800 dark:text-white">{value}</div>
            <div className="text-sm text-slate-500 dark:text-slate-400">{label}</div>
        </div>
    </div>
);


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
        <div className="space-y-10">
            <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-around gap-8 lg:gap-12">
                <ScoreGauge score={results.score} />
                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
                    <StatCard 
                        icon={<CheckCircleIcon className="w-7 h-7" />} 
                        value={results.blocked} 
                        label="Blocked"
                        color="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400"
                    />
                     <StatCard 
                        icon={<XCircleIcon className="w-7 h-7" />} 
                        value={results.loaded} 
                        label="Loaded"
                        color="bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400"
                    />
                    <StatCard 
                        icon={<Bars3BottomLeftIcon className="w-7 h-7" />} 
                        value={results.total} 
                        label="Total"
                        color="bg-slate-200 dark:bg-slate-600/30 text-slate-600 dark:text-slate-300"
                    />
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <button onClick={handleDownload} className="flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    <DownloadIcon className="w-5 h-5" /> Download JSON
                </button>
                 <button onClick={handleCopy} className="relative flex items-center gap-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-transform transform hover:scale-105">
                    <CopyIcon className="w-5 h-5" /> Copy Summary
                    {copySuccess && <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">{copySuccess}</span>}
                </button>
            </div>

            <div>
                <h3 className="text-xl font-bold text-center mb-4 text-slate-900 dark:text-white">Detailed Results</h3>
                <div className="flex flex-wrap justify-center gap-2 mb-6 p-2 bg-slate-100 dark:bg-slate-900/50 rounded-full">
                    <CategoryChip category="All" isActive={activeCategory === 'All'} onClick={() => setActiveCategory('All')} />
                    {CATEGORIES.map(cat => (
                        <CategoryChip key={cat} category={cat} isActive={activeCategory === cat} onClick={() => setActiveCategory(cat)} />
                    ))}
                </div>

                <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700/50 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-100 dark:bg-slate-900/50 text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-semibold">Domain</th>
                                    <th scope="col" className="px-6 py-3 font-semibold">Category</th>
                                    <th scope="col" className="px-6 py-3 font-semibold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBreakdown.map((item, index) => (
                                    <tr key={index} className="bg-white dark:bg-slate-800/80 border-b last:border-b-0 border-slate-200 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-800 dark:text-slate-200 whitespace-nowrap">{item.domain}</td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{item.category}</td>
                                        <td className="px-6 py-4 text-right">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                item.status === 'blocked' ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-400'
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
        </div>
    );
};

export default ResultsDisplay;
