
import React from 'react';

interface WaveformProps {
    width?: number;
    height?: number;
    color?: string;
    speed?: number;
    amplitude?: number;
    className?: string;
}

const Waveform: React.FC<WaveformProps> = ({
    width = 100,
    height = 40,
    color = 'currentColor',
    speed = 2,
    className = ''
}) => {
    // Fixed ViewBox for easy path definition
    const viewBoxWidth = 400;
    const viewBoxHeight = 100;
    const midY = viewBoxHeight / 2;

    // ECG-ish path: Flat -> P -> QRS -> T -> Flat
    const pathData = `
        M 0 ${midY} 
        L 120 ${midY} 
        L 130 ${midY - 10} 
        L 140 ${midY + 5} 
        L 150 ${midY - 40} 
        L 160 ${midY + 35} 
        L 170 ${midY - 5} 
        L 180 ${midY + 10} 
        L 190 ${midY} 
        L 210 ${midY} 
        L 220 ${midY - 15} 
        L 240 ${midY} 
        L 400 ${midY}
    `;

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
            <svg
                viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
                className="w-full h-full"
                preserveAspectRatio="none"
            >
                <defs>
                    <linearGradient id="scanGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100%" y2="0">
                        <stop offset="0%" stopColor={color} stopOpacity="0" />
                        <stop offset="5%" stopColor={color} stopOpacity="0" />
                        <stop offset="95%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="1" />
                    </linearGradient>

                    <mask id="scanMask">
                        <rect x="0" y="0" width="100%" height="100%" fill="black" />
                        <rect x="-100%" y="0" width="20%" height="100%" fill="white">
                            <animate
                                attributeName="x"
                                from="-20%"
                                to="120%"
                                dur={`${speed}s`}
                                repeatCount="indefinite"
                                fill="freeze"
                            />
                        </rect>
                    </mask>
                </defs>

                {/* Background Faint Line */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    opacity="0.1"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Active "Scan" Line */}
                {/* We simulate the 'dot' moving by using a gradient mask or simply drawing a polyline with a dasharray */}
                <path
                    d={pathData}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_4px_currentColor]"
                >
                    <animate
                        attributeName="stroke-dasharray"
                        values={`0 ${viewBoxWidth}; ${viewBoxWidth} 0; 0 ${viewBoxWidth}`}
                        keyTimes="0; 0.5; 1"
                        dur={`${speed}s`}
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="stroke-dashoffset"
                        values={`${viewBoxWidth}; 0; -${viewBoxWidth}`}
                        keyTimes="0; 0.5; 1"
                        dur={`${speed}s`}
                        repeatCount="indefinite"
                    />
                </path>

                {/* Scanning "Head" - A circle that follows the path? Hard with generic SVG. 
                    Let's stick to the stroke-dasharray trick which makes it look like it's being written.
                */}
            </svg>
        </div>
    );
};

export default Waveform;
