import React from 'react';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';

const ContactSection: React.FC = () => {
    return (
        <section id="contacto" className="py-24 bg-[#F9F6F4]">
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
    );
};

export default ContactSection;