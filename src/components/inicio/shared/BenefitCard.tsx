import React from 'react';

interface BenefitCardProps {
    icon: React.ReactNode;
    title: string;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title }) => (
    <div className="bg-white dark:bg-slate-700 p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 h-full">
        <div className="text-[#2E8B57] dark:text-green-400 mb-4">{icon}</div>
        <h3 className="font-semibold text-lg text-[#1E1E1E] dark:text-slate-200">{title}</h3>
    </div>
);

export default BenefitCard;