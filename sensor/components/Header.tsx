
import React from 'react';
import Icon from './Icon';

const Header: React.FC = () => {
    const [currentHash, setCurrentHash] = React.useState(window.location.hash || '#/');

    React.useEffect(() => {
        const handleHashChange = () => setCurrentHash(window.location.hash || '#/');
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const navItems = [
        { name: 'DASHBOARD', icon: 'dashboard', path: '#/' },
        { name: 'CONFIG', icon: 'memory', path: '#/settings' },
        { name: 'ABOUT', icon: 'info', path: '#/about' },
    ];

    const isActive = (path: string) => {
        const hash = currentHash.toLowerCase();
        const normalizedPath = path.toLowerCase().replace('#', '');

        if (normalizedPath === '/' || normalizedPath === '') {
            return hash === '#/' || hash === '' || hash === '#';
        }

        return hash.includes(normalizedPath);
    };




    return (
        <header className="h-10 flex-shrink-0 flex items-center px-4 glass-header z-50 transition-colors duration-500">
            <div className="flex items-center gap-2 w-32 font-black tracking-tighter text-[11px] text-slate-900 dark:text-white/90">
                <div className="w-5 h-5 bg-primary/20 flex items-center justify-center text-primary glow-blue">
                    <Icon name="radar" size={14} />
                </div>
                <span>SENTINEL</span>
            </div>

            <nav className="flex-1 flex justify-center">
                <div className="flex bg-black/5 dark:bg-white/5 p-0.5 border border-black/5 dark:border-white/5">
                    {navItems.map(item => (
                        <button
                            key={item.name}
                            onClick={() => window.location.hash = item.path}
                            className={`flex items-center gap-1.5 px-3 py-1 transition-all text-[9px] font-black tracking-[0.2em] ${isActive(item.path)
                                ? 'bg-primary text-white glow-blue'
                                : 'text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-black/5 dark:hover:bg-white/5'
                                }`}>
                            <Icon name={item.icon} size={12} />
                            {item.name}
                        </button>
                    ))}
                </div>
            </nav>

            <div className="w-32 flex justify-end items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                    <Icon name="notifications_active" size={14} />
                </button>
            </div>
        </header>

    );
};

export default Header;


