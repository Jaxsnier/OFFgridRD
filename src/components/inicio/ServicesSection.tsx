import React from 'react';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import ServiceCard from './shared/ServiceCard';

const ServicesSection: React.FC = () => {
    return (
        <section id="servicios" className="py-24 bg-[#F9F6F4]">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mb-4">Nuestros Servicios</h2>
                <p className="text-lg text-[#5B5B5B] max-w-3xl mx-auto mb-12">Ofrecemos soluciones energéticas completas, desde la planificación inicial hasta el mantenimiento a largo plazo.</p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                     <AnimateOnScroll direction="left">
                        <ServiceCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}
                            title="Instalación Residencial"
                            description="Transforma tu hogar en una fuente de energía limpia y reduce tu factura de luz a cero con nuestros sistemas personalizados."
                        />
                     </AnimateOnScroll>
                     <AnimateOnScroll direction="up" delay={200}>
                        <ServiceCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>}
                            title="Proyectos Comerciales"
                            description="Aumenta la rentabilidad de tu negocio con soluciones solares a gran escala, diseñadas para un máximo rendimiento y ahorro."
                        />
                    </AnimateOnScroll>
                    <AnimateOnScroll direction="right" delay={400}>
                        <ServiceCard
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.212l1.173-.42c.328-.118.67-.118.998 0l1.173.42c.55.195 1.02.67 1.11 1.212l.245.978c.033.132.067.263.106.393l.836 1.446c.26.45.26.98 0 1.43l-.836 1.446a6.98 6.98 0 01-.106.393l-.245.978a1.525 1.525 0 01-1.11 1.212l-1.173.42a.99.99 0 01-.998 0l-1.173-.42a1.525 1.525 0 01-1.11-1.212l-.245-.978a6.98 6.98 0 01-.106-.393l-.836-1.446c-.26-.45-.26-.98 0-1.43l.836-1.446c.04-.069.073-.13.106-.198l.245-.978zM14.25 12a2.25 2.25 0 10-4.5 0 2.25 2.25 0 004.5 0z" /></svg>}
                            title="Mantenimiento y Soporte"
                            description="Garantizamos el óptimo funcionamiento de tu sistema solar con planes de mantenimiento y un equipo de soporte siempre disponible."
                        />
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;