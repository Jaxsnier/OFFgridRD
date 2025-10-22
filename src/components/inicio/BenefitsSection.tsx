import React from 'react';
import { AnimateOnScroll } from '../ui/AnimateOnScroll';
import BenefitCard from './shared/BenefitCard';

const BenefitsSection: React.FC = () => {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-800">
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
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.471-2.471a.563.563 0 0 1 .8 0l3.535 3.535a.563.563 0 0 1 0 .8l-2.471 2.471m-4.243-4.243L6.172 9.928a.563.563 0 0 1 0-.8L9.928 6.172a.563.563 0 0 1 .8 0l2.471 2.471" /></svg>}
                            title="Soporte personalizado"
                        />
                    </AnimateOnScroll>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;