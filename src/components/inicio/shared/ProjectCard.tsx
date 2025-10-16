import React from 'react';

interface ProjectCardProps {
    image: string;
    title: string;
    description: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ image, title, description }) => (
    <div className="relative rounded-xl overflow-hidden group shadow-lg">
        <img src={image} alt={title} className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-white font-bold text-xl">{title}</h3>
            <p className="text-white/90">{description}</p>
        </div>
    </div>
);

export default ProjectCard;
