import React from 'react';

interface ServiceCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-start text-left h-full transition-shadow hover:shadow-xl">
        <div className="p-3 bg-[#2E8B57]/10 rounded-xl mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-xl text-[#1E1E1E] mb-2">{title}</h3>
        <p className="text-[#5B5B5B] flex-grow">{description}</p>
    </div>
);

export default ServiceCard;
