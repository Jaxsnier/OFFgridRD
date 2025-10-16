import React from 'react';

const Logo: React.FC = () => (
    <div className="flex items-center gap-2">
        <svg role="img" aria-label="Logo de OFFgridRD" className="w-10 h-10" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="#F76814"/>
            <path d="M100 29 L29 100 L45 100 C45 100 100 45 100 45 Z" fill="#F9F6F4" opacity="0.9" />
            <line x1="100" y1="55" x2="55" y2="100" stroke="#F9F6F4" strokeWidth="8" />
            <line x1="100" y1="75" x2="75" y2="100" stroke="#F9F6F4" strokeWidth="8" />
            <line x1="29" y1="100" x2="100" y2="29" stroke="#F76814" strokeWidth="2" />
        </svg>
        <span className="text-2xl font-bold text-[#5B5B5B]">OFFgridRD</span>
    </div>
);

export default Logo;
