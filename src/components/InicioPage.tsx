import React from 'react';
import HeroSection from './inicio/HeroSection';
import BenefitsSection from './inicio/BenefitsSection';
import ServicesSection from './inicio/ServicesSection';
import ProjectsSection from './inicio/ProjectsSection';
import ContactSection from './inicio/ContactSection';

const InicioPage: React.FC = () => {
    return (
        <div className="w-full h-full overflow-y-auto bg-white dark:bg-slate-900 font-['Poppins',_sans-serif]">
            <main>
                <HeroSection />
                <BenefitsSection />
                <ServicesSection />
                <ProjectsSection />
                <ContactSection />
            </main>
        </div>
    );
};

export default InicioPage;