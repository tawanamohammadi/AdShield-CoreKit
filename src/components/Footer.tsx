
import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 mt-12">
            <div className="container mx-auto px-4 py-6 text-center text-slate-500 dark:text-slate-400">
                <p>&copy; {new Date().getFullYear()} Tawana Network / Tawana Proxy. All Rights Reserved.</p>
                <p className="text-sm mt-1">AdShield-CoreKit by Tawana Mohammadi</p>
            </div>
        </footer>
    );
};

export default Footer;
