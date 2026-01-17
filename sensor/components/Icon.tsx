
import React from 'react';

interface IconProps {
    name: string;
    className?: string;
    size?: number;
}

const Icon: React.FC<IconProps> = ({ name, className, size = 20 }) => {
    const style = { width: `${size}px`, height: `${size}px`, fontSize: `${size}px` };

    // BESPOTKE TECHNICAL ICON SET
    const renderIcon = () => {
        switch (name) {
            case 'pulse':
            case 'vibration':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="3" y="10" width="2" height="4" rx="0.5" />
                        <rect x="6" y="7" width="2" height="10" rx="0.5" opacity="0.5" />
                        <rect x="9" y="4" width="2" height="16" rx="0.5" />
                        <rect x="12" y="8" width="2" height="8" rx="0.5" opacity="0.8" />
                        <rect x="15" y="5" width="2" height="14" rx="0.5" />
                        <rect x="18" y="9" width="2" height="6" rx="0.5" opacity="0.6" />
                        <rect x="21" y="11" width="2" height="2" rx="0.5" opacity="0.4" />
                    </svg>
                );
            case 'uptime':
            case 'timer':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="9" strokeOpacity="0.2" />
                        <path d="M12 7v5l3 3" />
                        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z" strokeOpacity="0.1" />
                        <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                        <path d="M12 2v2M12 20v2M2 12h2M20 12h2" strokeOpacity="0.4" strokeWidth="1" />
                    </svg>
                );
            case 'radar':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
                        <circle cx="12" cy="12" r="6" strokeOpacity="0.4" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M12 2v4M12 18v4M2 12h4M18 12h4" strokeOpacity="0.5" />
                        <path d="M12 12l7-7" strokeWidth="2" />
                    </svg>
                );
            case 'dns':
                return (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <rect x="2" y="4" width="20" height="7" rx="1" />
                        <rect x="2" y="13" width="20" height="7" rx="1" />
                        <circle cx="6" cy="7.5" r="1" fill="white" fillOpacity="0.8" />
                        <circle cx="9" cy="7.5" r="1" fill="white" fillOpacity="0.8" />
                        <circle cx="6" cy="16.5" r="1" fill="white" fillOpacity="0.8" />
                        <circle cx="9" cy="16.5" r="1" fill="white" fillOpacity="0.8" />
                    </svg>
                );
            case 'memory':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="5" y="5" width="14" height="14" rx="1" />
                        <rect x="9" y="9" width="6" height="6" rx="0.5" fill="currentColor" fillOpacity="0.2" />
                        <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
                    </svg>
                );
            case 'notifications_active':
            case 'notifications':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        <path d="M12 2v2" strokeOpacity="0.5" />
                    </svg>
                );
            case 'identity_platform':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                );
            case 'fingerprint':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 10a2 2 0 0 0-2 2M14 12a2 2 0 0 1-2 2M16 12a4 4 0 0 0-4-4M12 16a4 4 0 0 1-4-4M18 12a6 6 0 0 0-6-6M12 18a6 6 0 0 1-6-6M20 12a8 8 0 0 0-8-8M12 20a8 8 0 0 1-8-8" />
                    </svg>
                );
            case 'verified':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        <path d="M9 12l2 2 4-4" />
                    </svg>
                );
            case 'segment':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 6h16M4 12h12M4 18h8" />
                    </svg>
                );

            case 'home':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                    </svg>
                );
            case 'settings':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                );
            case 'info':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="16" x2="12" y2="12" />
                        <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                );
            case 'policy':
                return (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M9 15l2 2 4-4" />
                    </svg>
                );
            default:
                return null;
        }
    };


    const customIcon = renderIcon();

    if (customIcon) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
                <svg
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    className="w-full h-full"
                    {...customIcon.props}
                >
                    {customIcon.props.children}
                </svg>
            </div>
        );
    }

    return (
        <span className={`material-icons-round ${className}`} style={style}>
            {name}
        </span>
    );
};



export default Icon;
