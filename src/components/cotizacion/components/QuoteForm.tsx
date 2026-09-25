import React from 'react';
import { QuoteInput } from '../types';
import ClientInfoSection from './form/ClientInfoSection';
import SystemSizingSection from './form/SystemSizingSection';
import ExtrasAndEdesSection from './form/ExtrasAndEdesSection';
import InternalMarginSection from './form/InternalMarginSection';

interface QuoteFormProps {
    input: QuoteInput;
    onChange: (updated: Partial<QuoteInput>) => void;
    onClientChange: (field: string, value: string) => void;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ input, onChange, onClientChange }) => {
    return (
        <div className="space-y-6">
            <ClientInfoSection
                input={input}
                onChange={onChange}
                onClientChange={onClientChange}
            />
            <SystemSizingSection
                input={input}
                onChange={onChange}
            />
            <ExtrasAndEdesSection
                input={input}
                onChange={onChange}
            />
            <InternalMarginSection
                input={input}
                onChange={onChange}
            />
        </div>
    );
};

export default QuoteForm;
