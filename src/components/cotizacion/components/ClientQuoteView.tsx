import React, { useState } from 'react';
import { QuoteCalculationResult, QuoteInput } from '../types';
import { printElementById } from '../utils/printHelper';
import ClientQuoteActionBar from './client-quote/ClientQuoteActionBar';
import ClientQuoteHeader from './client-quote/ClientQuoteHeader';
import ClientQuoteEquipmentTable from './client-quote/ClientQuoteEquipmentTable';
import ClientQuoteFooter from './client-quote/ClientQuoteFooter';
import {
    buildClientQuoteShareText,
    buildClientWhatsAppUrl
} from './client-quote/clientQuoteShareHelper';

interface ClientQuoteViewProps {
    input: QuoteInput;
    calculation: QuoteCalculationResult;
    onBackToEdit: () => void;
    onViewInternalBudget: () => void;
}

export const ClientQuoteView: React.FC<ClientQuoteViewProps> = ({
    input,
    calculation,
    onBackToEdit,
    onViewInternalBudget
}) => {
    const [copied, setCopied] = useState(false);

    const handlePrint = () => {
        const title = `Cotizacion_${input.client.quoteNumber || 'Solar'}_${input.client.name.replace(/\s+/g, '_')}`;
        printElementById('printable-client-quote-document', title);
    };

    const handleCopyText = () => {
        const text = buildClientQuoteShareText(input, calculation);
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    };

    const handleWhatsApp = () => {
        const url = buildClientWhatsAppUrl(input, calculation);
        window.open(url, '_blank');
    };

    return (
        <div className="space-y-6">
            <ClientQuoteActionBar
                copied={copied}
                onBackToEdit={onBackToEdit}
                onViewInternalBudget={onViewInternalBudget}
                onCopyText={handleCopyText}
                onWhatsApp={handleWhatsApp}
                onPrint={handlePrint}
            />

            <div
                id="printable-client-quote-document"
                className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-lg border border-slate-200 max-w-4xl mx-auto flex flex-col justify-between print:border-none print:shadow-none print:p-0 print:m-0"
            >
                <ClientQuoteHeader input={input} calculation={calculation} />
                <ClientQuoteEquipmentTable input={input} calculation={calculation} />
                <ClientQuoteFooter input={input} calculation={calculation} />
            </div>
        </div>
    );
};

export default ClientQuoteView;
