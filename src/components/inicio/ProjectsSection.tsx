import React from 'react';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import ProjectCard from './shared/ProjectCard';

const ProjectsSection: React.FC = () => {
    return (
        <section id="proyectos" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mb-4">Proyectos Destacados</h2>
                    <p className="text-lg text-[#5B5B5B] max-w-3xl mx-auto">Conoce cómo hemos ayudado a familias y empresas a dar el paso hacia la independencia energética.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimateOnScroll direction="left">
                       <ProjectCard 
                            image="https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imgtarjeta1/IMG_1.jpg"
                            title="Residencia en Santiago"
                            description="Ahorro del 95% en factura eléctrica."
                        />
                    </AnimateOnScroll>
                    <AnimateOnScroll direction="up" delay={200}>
                        <ProjectCard 
                            image="https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imgtarjeta2/IMG_1.jpg"
                            title="Negocio en Santo Domingo"
                            description="Retorno de inversión en menos de 4 años."
                        />
                    </AnimateOnScroll>
                    <AnimateOnScroll direction="right" delay={400}>
                        <ProjectCard 
                            image="https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imgtarjeta3/IMG_1.jpg"
                            title="Finca en La Vega"
                            description="Energía ininterrumpida para operaciones."
                        />
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    );
};

export default ProjectsSection;