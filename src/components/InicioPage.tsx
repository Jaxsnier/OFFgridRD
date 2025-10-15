import React, { useState } from 'react';

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
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center transform transition-transform hover:-translate-y-2">
        <div className="text-[#2E8B57] mb-4">{icon}</div>
        <h3 className="font-semibold text-lg text-[#1E1E1E]">{title}</h3>
    </div>
);

const InicioPage: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Inicio', href: '#' },
        { name: 'Servicios', href: '#' },
        { name: 'Proyectos', href: '#' },
        { name: 'Contacto', href: '#' },
    ];

    return (
        <div className="w-full h-full overflow-y-auto bg-[#F9F6F4] font-['Poppins',_sans-serif]">
            {/* Header */}
            <header className="sticky top-0 bg-[#F9F6F4]/80 backdrop-blur-lg z-30">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Logo />
                        <nav className="hidden lg:flex items-center gap-8">
                            {navLinks.map(link => (
                                <a key={link.name} href={link.href} className="text-[#5B5B5B] font-medium hover:text-[#F76814] transition-colors">{link.name}</a>
                            ))}
                        </nav>
                        <a href="#" className="hidden lg:inline-block bg-[#2E8B57] text-white font-semibold px-6 py-2 rounded-lg shadow-sm hover:bg-opacity-90 transition-all">
                            Cotizar Ahora
                        </a>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-[#5B5B5B] z-50">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div className={`fixed inset-0 bg-[#F9F6F4] z-40 transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
                <nav className="flex flex-col items-center justify-center h-full gap-8">
                    {navLinks.map(link => (
                        <a key={link.name} href={link.href} className="text-2xl text-[#5B5B5B] font-medium hover:text-[#F76814] transition-colors" onClick={() => setIsMenuOpen(false)}>{link.name}</a>
                    ))}
                    <a href="#" className="bg-[#2E8B57] text-white text-xl font-semibold px-8 py-4 rounded-lg shadow-sm hover:bg-opacity-90 transition-all mt-4" onClick={() => setIsMenuOpen(false)}>
                        Cotizar Ahora
                    </a>
                </nav>
            </div>
            
            {/* Main Content */}
            <main>
                {/* Hero Section */}
                <section className="relative container mx-auto px-6 pt-16 pb-24 overflow-hidden">
                    <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-[#F76814]/10 rounded-full blur-3xl -z-10"></div>
                    <div className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-96 h-96 bg-[#2E8B57]/10 rounded-full blur-3xl -z-10"></div>
                    
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] leading-tight mb-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                                Energía solar accesible para todos en República Dominicana
                            </h1>
                            <p className="text-lg md:text-xl text-[#5B5B5B] mb-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
                                En OFFgridRD te ayudamos a eliminar tu factura eléctrica con sistemas solares al mejor precio.
                            </p>
                            <a href="#" className="inline-block bg-[#F76814] text-white font-bold text-lg px-10 py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300 fade-in-up" style={{ animationDelay: '0.6s' }}>
                                Solicitar Cotización
                            </a>
                        </div>
                        <div className="relative fade-in-up" style={{ animationDelay: '0.3s' }}>
                            <div className="bg-white/60 p-4 rounded-2xl shadow-lg">
                                <img src="https://images.unsplash.com/photo-1509390494483-8de8a7153926?q=80&w=2070&auto=format&fit=crop" alt="Casa con paneles solares" className="rounded-xl aspect-video object-cover" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Benefits Section */}
                <section className="py-24 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <BenefitCard 
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 11.21 12.77 11 12 11s-1.536.21-2.121.782c-1.172.879-1.172 2.303 0 3.182z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 7.875A10.125 10.125 0 0 0 12 3v2.25A7.875 7.875 0 0 1 4.5 12.75H3.75Z" /></svg>}
                                    title="Ahorro garantizado"
                                />
                            </div>
                            <div className="fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <BenefitCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Z" /></svg>}
                                    title="Instalaciones seguras y certificadas"
                                />
                            </div>
                            <div className="fade-in-up" style={{ animationDelay: '0.6s' }}>
                                <BenefitCard
                                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962a3.752 3.752 0 0 1-4.493 2.962 3.752 3.752 0 0 1-4.493-2.962m11.25 0c.398-1.537.992-2.912 1.741-4.144A3.752 3.752 0 0 1 18 9.75c.398 1.537.992 2.912 1.741 4.144m-9.75-2.962c.398-1.537.992-2.912 1.741-4.144A3.752 3.752 0 0 1 12 9.75c.398 1.537.992 2.912 1.741 4.144" /></svg>}
                                    title="Soporte personalizado"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default InicioPage;
