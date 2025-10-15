import React, { useRef, useState, useEffect } from 'react';

// --- Reusable Animation Logic ---

/**
 * Custom hook to detect when an element is visible in the viewport.
 * Uses IntersectionObserver for performance.
 * @param options - IntersectionObserver options
 * @returns A ref to attach to the element and a boolean indicating visibility.
 */
const useAnimateOnScroll = (options: IntersectionObserverInit = { threshold: 0.1 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const currentRef = ref.current;
        if (!currentRef) return;

        const observer = new IntersectionObserver(([entry]) => {
            // Set visibility based on whether the element is intersecting, allowing animations to repeat.
            setIsVisible(entry.isIntersecting);
        }, options);

        observer.observe(currentRef);

        return () => {
            if (currentRef) {
                observer.unobserve(currentRef); // Cleanup on unmount
            }
        };
    }, [options]);

    return [ref, isVisible] as const;
};

/**
 * A wrapper component to apply slide-in animations on scroll.
 */
const AnimateOnScroll = ({ children, direction = 'up', delay = 0 }: { children: React.ReactNode, direction?: 'up' | 'left' | 'right', delay?: number }) => {
    const [ref, isVisible] = useAnimateOnScroll();
    
    const directionClasses = {
        up: 'translate-y-10',
        left: '-translate-x-10',
        right: 'translate-x-10',
    };

    return (
        <div 
            ref={ref}
            style={{ transitionDelay: `${delay}ms` }}
            className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-x-0 translate-y-0' : `opacity-0 ${directionClasses[direction]}`}`}
        >
            {children}
        </div>
    );
};


// --- Component Definitions ---

const Logo = () => (
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

const BenefitCard = ({ icon, title }: { icon: React.ReactNode, title: string }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition-transform hover:-translate-y-2 h-full">
        <div className="text-[#2E8B57] mb-4">{icon}</div>
        <h3 className="font-semibold text-lg text-[#1E1E1E]">{title}</h3>
    </div>
);

const ServiceCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-lg flex flex-col items-start text-left h-full transition-shadow hover:shadow-xl">
        <div className="p-3 bg-[#2E8B57]/10 rounded-xl mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-xl text-[#1E1E1E] mb-2">{title}</h3>
        <p className="text-[#5B5B5B] flex-grow">{description}</p>
    </div>
);

const ProjectCard = ({ image, title, description }: { image: string, title: string, description: string }) => (
    <div className="relative rounded-xl overflow-hidden group shadow-lg">
        <img src={image} alt={title} className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-6">
            <h3 className="text-white font-bold text-xl">{title}</h3>
            <p className="text-white/90">{description}</p>
        </div>
    </div>
);


const InicioPage: React.FC = () => {
    return (
        <div className="w-full h-full overflow-y-auto bg-[#F9F6F4] font-['Poppins',_sans-serif]">
            <main>
                {/* Hero Section */}
                <section id="inicio" className="relative container mx-auto px-6 pt-16 pb-24 overflow-hidden">
                    <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-[#F76814]/10 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-[#2E8B57]/10 rounded-full blur-3xl -z-10"></div>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                            <div className="mb-6">
                                <Logo />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] leading-tight mb-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                                Energía solar accesible para todos en República Dominicana
                            </h1>
                            <p className="text-lg md:text-xl text-[#5B5B5B] mb-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
                                En OFFgridRD te ayudamos a eliminar tu factura eléctrica con sistemas solares al mejor precio.
                            </p>
                            <a 
                                href="https://wa.me/18296392616?text=¡Hola!%20Quisiera%20solicitar%20una%20cotización%20para%20un%20sistema%20de%20paneles%20solares."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block bg-[#F76814] text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 fade-in-up" 
                                style={{ animationDelay: '0.6s' }}>
                                Solicitar Cotización
                            </a>
                        </div>
                        <div className="relative fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="bg-white/60 p-4 rounded-2xl shadow-lg">
                                <img src="https://images.unsplash.com/photo-1624322833035-300b2b73714d?q=80&w=2070&auto=format&fit=crop" alt="Casa con paneles solares" className="rounded-xl aspect-video object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            <AnimateOnScroll direction="left">
                                <BenefitCard 
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11s-1.536.21-2.121.782c-1.172.879-1.172 2.303 0 3.182z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.875A10.125 10.125 0 0 0 12 3v2.25A7.875 7.875 0 0 1 4.5 12.75H3.75Z" /></svg>}
                                    title="Ahorro garantizado"
                                />
                            </AnimateOnScroll>
                            <AnimateOnScroll direction="up" delay={200}>
                                <BenefitCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Z" /></svg>}
                                    title="Instalaciones seguras y certificadas"
                                />
                            </AnimateOnScroll>
                            <AnimateOnScroll direction="right" delay={400}>
                                <BenefitCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962a3.752 3.752 0 0 1-4.493 2.962 3.752 3.752 0 0 1-4.493-2.962m11.25 0c.398-1.537.992-2.912 1.741-4.144A3.752 3.752 0 0 1 18 9.75c.398 1.537.992 2.912 1.741 4.144" /></svg>}
                                    title="Soporte personalizado"
                                />
                            </AnimateOnScroll>
                        </div>
                    </div>
                </section>
                
                {/* Services Section */}
                <section id="servicios" className="py-24 bg-[#F9F6F4] overflow-hidden">
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
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>}
                                    title="Mantenimiento y Soporte"
                                    description="Garantizamos el óptimo funcionamiento de tu sistema solar con planes de mantenimiento y un equipo de soporte siempre disponible."
                                />
                            </AnimateOnScroll>
                        </div>
                    </div>
                </section>

                {/* Projects Section */}
                <section id="proyectos" className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mb-4">Proyectos Destacados</h2>
                            <p className="text-lg text-[#5B5B5B] max-w-3xl mx-auto">Conoce cómo hemos ayudado a familias y empresas a dar el paso hacia la independencia energética.</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimateOnScroll direction="left">
                               <ProjectCard 
                                    image="https://images.unsplash.com/photo-1598354220228-726f5d88a481?q=80&w=2070&auto=format&fit=crop"
                                    title="Residencia en Santiago"
                                    description="Ahorro del 95% en factura eléctrica."
                                />
                            </AnimateOnScroll>
                            <AnimateOnScroll direction="up" delay={200}>
                                <ProjectCard 
                                    image="https://images.unsplash.com/photo-1507683255338-6510f2b322a3?q=80&w=2070&auto=format&fit=crop"
                                    title="Negocio en Santo Domingo"
                                    description="Retorno de inversión en menos de 4 años."
                                />
                            </AnimateOnScroll>
                            <AnimateOnScroll direction="right" delay={400}>
                                <ProjectCard 
                                    image="https://images.unsplash.com/photo-1617498725997-7d047a0648f5?q=80&w=1974&auto=format&fit=crop"
                                    title="Finca en La Vega"
                                    description="Energía ininterrumpida para operaciones."
                                />
                            </AnimateOnScroll>
                        </div>
                    </div>
                </section>
                
                {/* Contact Section */}
                <section id="contacto" className="py-24 bg-[#F9F6F4] overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12">
                             <h2 className="text-3xl md:text-4xl font-bold text-[#1E1E1E] mb-4">¿Listo para empezar a ahorrar?</h2>
                            <p className="text-lg text-[#5B5B5B] max-w-3xl mx-auto">Contáctanos hoy mismo para una evaluación gratuita y sin compromiso.</p>
                        </div>
                        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-12 bg-white p-8 md:p-12 rounded-2xl shadow-lg">
                            <AnimateOnScroll direction="left">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1E1E1E] mb-6">Envíanos un mensaje</h3>
                                    <form action="#" method="POST" className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="sr-only">Nombre</label>
                                            <input type="text" name="name" id="name" placeholder="Tu Nombre" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F76814]" />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="sr-only">Correo</label>
                                            <input type="email" name="email" id="email" placeholder="Tu Correo Electrónico" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F76814]" />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="sr-only">Teléfono</label>
                                            <input type="tel" name="phone" id="phone" placeholder="Tu Teléfono" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F76814]" />
                                        </div>
                                        <div>
                                            <label htmlFor="message" className="sr-only">Mensaje</label>
                                            <textarea name="message" id="message" rows={4} placeholder="Cuéntanos sobre tu proyecto..." className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#F76814]"></textarea>
                                        </div>
                                        <button type="submit" className="w-full bg-[#F76814] text-white font-bold text-lg px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                                            Enviar Solicitud
                                        </button>
                                    </form>
                                </div>
                            </AnimateOnScroll>
                             <AnimateOnScroll direction="right" delay={200}>
                                 <div className="flex flex-col justify-center space-y-6">
                                     <h3 className="text-2xl font-bold text-[#1E1E1E] mb-2 lg:hidden">O contáctanos directamente</h3>
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-[#2E8B57]/10 rounded-xl">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1E1E1E]">Teléfono</h4>
                                            <a href="tel:+18091234567" className="text-[#5B5B5B] hover:text-[#F76814]">(809) 123-4567</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                         <div className="p-3 bg-[#2E8B57]/10 rounded-xl">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1E1E1E]">Correo Electrónico</h4>
                                            <a href="mailto:cotizaciones@offgridrd.com" className="text-[#5B5B5B] hover:text-[#F76814]">cotizaciones@offgridrd.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                         <div className="p-3 bg-[#2E8B57]/10 rounded-xl">
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#2E8B57]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657l-4.243-4.243a1 1 0 00-1.414 0l-4.243 4.243a1 1 0 001.414 1.414L12 13.414l2.828 2.829a1 1 0 001.414-1.414z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-[#1E1E1E]">Dirección</h4>
                                            <p className="text-[#5B5B5B]">Av. Principal 123, Santiago,<br/>República Dominicana</p>
                                        </div>
                                    </div>
                                </div>
                             </AnimateOnScroll>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default InicioPage;