import React, { useState } from 'react';

interface CalculatorFormProps {
    onSubmit: (bill: number) => void;
    isLoading: boolean;
}

const CalculatorForm: React.FC<CalculatorFormProps> = ({ onSubmit, isLoading }) => {
    const [monthlyBill, setMonthlyBill] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        const bill = parseFloat(monthlyBill);

        if (isNaN(bill) || bill <= 0) {
            setError('Por favor, ingrese un monto válido para su factura.');
            return;
        }
        
        setError('');
        onSubmit(bill);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg mb-8 max-w-4xl mx-auto">
            <form onSubmit={handleCalculate} className="grid sm:grid-cols-3 gap-6 items-end">
                <div className="sm:col-span-2">
                    <label htmlFor="monthlyBill" className="block text-sm font-semibold text-slate-700 mb-2">
                        ¿Cuánto paga de luz mensualmente? (RD$)
                    </label>
                    <div className="relative">
                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 font-bold">
                            $
                        </span>
                        <input
                            id="monthlyBill"
                            type="number"
                            value={monthlyBill}
                            onChange={(e) => setMonthlyBill(e.target.value)}
                            placeholder="Ej: 5000"
                            required
                            className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F76814] text-lg"
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#F76814] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#e65c0d] transition-colors duration-300 flex items-center justify-center text-lg disabled:bg-slate-400 disabled:cursor-wait"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Calculando...
                        </>
                    ) : 'Calcular Estimación'}
                </button>
            </form>
        </div>
    );
};

export default CalculatorForm;
