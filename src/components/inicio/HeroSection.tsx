import React, { useState, useEffect } from 'react';
import Logo from './shared/Logo';

const HeroSection: React.FC = () => {
    const carouselImages = [
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_1.jpg', alt: 'Instalación de paneles solares en techo residencial' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_2.jpg', alt: 'Vista detallada de paneles solares' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_3.jpg', alt: 'Equipo de inversores y baterías' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_4.jpg', alt: 'Paneles solares instalados en un techo de tejas' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_5.jpg', alt: 'Instalación solar en progreso' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_6.jpg', alt: 'Vista panorámica de instalación solar' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_7.jpg', alt: 'Técnico ajustando paneles solares' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_8.jpg', alt: 'Sistema de montaje de paneles solares' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_9.jpg', alt: 'Paneles solares bajo el cielo azul' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_10.jpg', alt: 'Instalación comercial con múltiples filas de paneles' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_11.jpg', alt: 'Detalle del cableado del sistema solar' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_12.jpg', alt: 'Inversores solares montados en la pared' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_13.jpg', alt: 'Paneles solares reflejando el sol' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_14.jpg', alt: 'Instalación en un techo plano' },
        { src: 'https://raw.githubusercontent.com/Jaxsnier/offgridrd-assets/main/imghero/IMG_15.jpg', alt: 'Sistema solar completo con baterías' }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prevSlide => (prevSlide + 1) % carouselImages.length);
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(slideInterval);
    }, [carouselImages.length]);

    const goToSlide = (slideIndex: number) => {
        setCurrentSlide(slideIndex);
    };

    const nextSlide = () => {
        setCurrentSlide(prevSlide => (prevSlide + 1) % carouselImages.length);
    };

    const prevSlide = () => {
        setCurrentSlide(prevSlide => (prevSlide - 1 + carouselImages.length) % carouselImages.length);
    };

    return (
        <section id="inicio" className="relative container mx-auto px-6 pt-16 pb-24 overflow-hidden">
            <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-[#F76814]/10 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-[#2E8B57]/10 rounded-full blur-3xl -z-10"></div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                    <div className="mb-6">
                        <Logo />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] dark:text-slate-100 leading-tight mb-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                        Energía solar accesible para todos en República Dominicana
                    </h1>
                    <p className="text-lg md:text-xl text-[#5B5B5B] dark:text-slate-400 mb-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
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
                    <div className="relative bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl shadow-lg w-full aspect-video overflow-hidden">
                        <div className="relative h-full w-full rounded-xl overflow-hidden">
                            {carouselImages.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.src}
                                    alt={image.alt}
                                    className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                                        currentSlide === index ? 'opacity-100' : 'opacity-0'
                                    }`}
                                />
                            ))}
                        </div>
                        <button
                            onClick={prevSlide}
                            className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-slate-800 p-2 rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Diapositiva anterior"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white/50 hover:bg-white/80 text-slate-800 p-2 rounded-full transition-colors z-10 focus:outline-none focus:ring-2 focus:ring-white"
                            aria-label="Siguiente diapositiva"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                        <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex space-x-2 z-10">
                            {carouselImages.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Ir a la diapositiva ${index + 1}`}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                                        currentSlide === index ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;