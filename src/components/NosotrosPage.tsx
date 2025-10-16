import React from 'react';
import { AnimateOnScroll } from './ui/AnimateOnScroll';

const NosotrosPage: React.FC = () => {

    const values = [
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7zM16 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
            title: "Honestidad",
            description: "La base de cada proyecto que emprendemos."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
            title: "Calidad",
            description: "Usamos materiales y técnicas profesionales para garantizar durabilidad."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
            title: "Personalización",
            description: "Cada instalación se adapta a las necesidades únicas del cliente."
        },
        {
            icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 12v-1m0 1v.01M12 12v-1m0 1v.01M12 12v-1m0 1v.01M12 16v-1m0 1v.01M12 16v-1m0 1v.01M12 16v-1m0 1v.01" /><path strokeLinecap="round" strokeLinejoin="round" d="M7 16h10" /></svg>,
            title: "Accesibilidad",
            description: "Precios justos sin comprometer la calidad del resultado final."
        }
    ];

    return (
        <div className="w-full bg-white h-full overflow-y-auto font-['Poppins',_sans-serif]">
            <header className="bg-[#F9F6F4] py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                     <AnimateOnScroll>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] leading-tight mb-4">
                            Nuestra Historia: Pasión por la Energía Solar
                        </h1>
                        <p className="text-lg md:text-xl text-[#5B5B5B]">
                            De un proyecto personal a una misión para independizar a República Dominicana de la red eléctrica.
                        </p>
                    </AnimateOnScroll>
                </div>
            </header>
            
            <main className="py-20">
                <div className="max-w-4xl mx-auto px-6 space-y-20">

                    <section>
                        <AnimateOnScroll>
                            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">El Comienzo del Viaje</h2>
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-slate-200 before:content-[''] before:self-start">
                                
                                <div className="relative pl-14">
                                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#F76814]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-800 mb-1">Enero 2023: La Chispa Inicial</h3>
                                    <p className="text-slate-600">OFFgridRD nació de la curiosidad y la pasión por la tecnología. Su fundador, Eligio Estévez, construyó una PowerWall personal con pilas 18650, un experimento que le abrió las puertas al fascinante mundo de la energía solar, los inversores y los controladores MPPT.</p>
                                </div>

                                <div className="relative pl-14">
                                     <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#F76814]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-800 mb-1">El Primer Proyecto</h3>
                                    <p className="text-slate-600">Poco después, un conocido pidió ayuda para instalar 3 paneles bifaciales de 550 W. Este primer trabajo fue un éxito y reveló tanto los retos reales del oficio como la satisfacción de ayudar a otros a aprovechar la energía del sol.</p>
                                </div>

                                <div className="relative pl-14">
                                    <div className="absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full bg-[#2E8B57]">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9V3m0 18a9 9 0 009-9M3 12a9 9 0 019-9m0 18a9 9 0 00-9-9m9-9c-5.42 0-9 3.582-9 9s3.582 9 9 9z" /></svg>
                                    </div>
                                    <h3 className="font-bold text-xl text-slate-800 mb-1">Mayo 2024: Nace OFFgridRD</h3>
                                    <p className="text-slate-600">Esa pasión se convirtió en propósito. OFFgridRD se fundó como una empresa dominicana con una misión clara: “Desconéctate de la red.”</p>
                                </div>
                            </div>
                        </AnimateOnScroll>
                    </section>
                    
                    <section className="grid md:grid-cols-2 gap-12 items-center">
                        <AnimateOnScroll direction="left">
                            <div className="bg-[#F9F6F4] p-8 rounded-xl">
                                <h3 className="text-2xl font-bold text-[#F76814] mb-4">Nuestra Misión</h3>
                                <p className="text-slate-600">Llevar energía solar accesible, confiable y de calidad a cada hogar dominicano, ayudando a las personas a independizarse de la red eléctrica y disfrutar de una vida más sostenible.</p>
                            </div>
                        </AnimateOnScroll>
                        <AnimateOnScroll direction="right">
                             <div className="bg-[#F9F6F4] p-8 rounded-xl">
                                <h3 className="text-2xl font-bold text-[#2E8B57] mb-4">Nuestra Visión</h3>
                                <p className="text-slate-600">Ser la primera opción en República Dominicana cuando alguien piense en instalar paneles solares, reconocidos por nuestra honestidad, calidad y atención personalizada.</p>
                            </div>
                        </AnimateOnScroll>
                    </section>

                    <section>
                        <AnimateOnScroll>
                            <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">Nuestros Valores</h2>
                        </AnimateOnScroll>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <AnimateOnScroll key={value.title} delay={index * 150} direction="up">
                                    <div className="text-center p-6 bg-slate-50 rounded-lg h-full">
                                        <div className="flex items-center justify-center h-16 w-16 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] mx-auto mb-4">
                                            {value.icon}
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800 mb-2">{value.title}</h3>
                                        <p className="text-slate-600 text-sm">{value.description}</p>
                                    </div>
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </section>
                    
                    <section className="bg-gradient-to-r from-[#F76814] to-[#f8813a] text-white p-12 rounded-xl">
                         <AnimateOnScroll>
                            <h2 className="text-3xl font-bold mb-4 text-center">Hoy: Un Compromiso Personal</h2>
                            <div className="text-center max-w-3xl mx-auto space-y-4 text-white/90">
                                <p>OFFgridRD se enfoca principalmente en instalaciones residenciales y proyectos de autoconsumo. Además, ofrecemos mantenimiento, diagnóstico y ampliación de sistemas existentes.</p>
                                <p>Eligio trabaja directamente con cada cliente y coordina un equipo técnico según las necesidades de cada proyecto, garantizando siempre transparencia y un trato cercano.</p>
                            </div>
                        </AnimateOnScroll>
                    </section>

                </div>
            </main>
        </div>
    );
};

export default NosotrosPage;