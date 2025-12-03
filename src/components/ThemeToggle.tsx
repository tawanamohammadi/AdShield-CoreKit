import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from './Icons';
import { cn } from '../utils/cn';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('adshield:theme') as 'light' | 'dark') || 'dark',
  );

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      document.body.classList.add('light');
    } else {
      root.classList.remove('light');
      document.body.classList.remove('light');
    }
    localStorage.setItem('adshield:theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
        'bg-white/10 hover:bg-white/20 border border-white/10 shadow',
        'light:bg-slate-100 light:text-slate-800 light:border-slate-200 light:hover:bg-white',
      )}
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      <span>{theme === 'light' ? 'Dark' : 'Light'} mode</span>
    </button>
  );
};

export default ThemeToggle;
