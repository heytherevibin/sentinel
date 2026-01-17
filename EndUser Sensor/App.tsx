import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import SettingsView from './components/SettingsView';
import AboutView from './components/AboutView';
import { useSensor } from './src/hooks/useSensor';

const App: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );
    const [currentView, setCurrentView] = useState<'dashboard' | 'settings' | 'about'>('dashboard');
    const sensor = useSensor();

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e: MediaQueryListEvent) => {
            setIsDarkMode(e.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        if (isDarkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [isDarkMode]);


    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.toLowerCase();
            if (hash.includes('settings') || hash.includes('config')) {
                setCurrentView('settings');
            } else if (hash.includes('about')) {
                setCurrentView('about');
            } else {
                setCurrentView('dashboard');
            }
        };

        handleHashChange();
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);


    const renderContent = () => {
        switch (currentView) {
            case 'settings':
                return <SettingsView />;
            case 'about':
                return <AboutView />;
            case 'dashboard':
            default:
                return <Dashboard sensor={sensor} />;
        }
    };

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden relative transition-colors duration-500">
            <Header />
            <main className="flex-1 relative overflow-hidden flex flex-col">

                {renderContent()}
            </main>
            <Footer sensor={sensor} />
        </div>
    );
};



export default App;

