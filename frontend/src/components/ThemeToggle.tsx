import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Init dark mode from local storage or system preference
        const isDarkMode = localStorage.getItem('theme') === 'dark' || 
            (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
        
        setIsDark(isDarkMode);
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            setIsDark(true);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors w-9 h-9"
            title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
        >
            {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </Button>
    );
}
