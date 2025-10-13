import React, { useRef } from 'react';
import { Client } from '../types';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: 'potenciales' | 'nosotros';
    onNavClick: (view: 'potenciales' | 'nosotros') => void;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    fileError: string;
    isSettingCenter: boolean;
    onSetCenterClick: () => void;
    radiusKm: number;
    onRadiusChange: (value: number) => void;
    onFilterClick: () => void;
    referencePoint: any;
    filteredClients: Client[];
    paginatedClients: Client[];
    selectedClientId: string | null;
    onClientSelect: (client: Client) => void;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    activeView,
    onNavClick,
    onFileChange,
    loading,
    fileError,
    isSettingCenter,
    onSetCenterClick,
    radiusKm,
    onRadiusChange,
    onFilterClick,
    referencePoint,
    filteredClients,
    paginatedClients,
    selectedClientId,
    onClientSelect,
    totalPages,
    currentPage,
    onPageChange
}) => {
    const resultListRef = useRef<HTMLUListElement>(null);

    return (
        <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            <div className={`relative w-full max-w-sm bg-white h-full shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="text-xl font-bold text-slate-800">Menú</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="Cerrar menú">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-65px)]">
                    <nav className="p-4 border-b">
                        <ul>
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('potenciales'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'potenciales' ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                                    Base De Datos
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('nosotros'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'nosotros' ? 'bg-blue-100 text-blue-700' : 'text-slate-700 hover:bg-slate-100'}`}>
                                    Nosotros
                                </a>
                            </li>
                        </ul>
                    </nav>
                    
                    {activeView === 'potenciales' && (
                       <div className="p-6 flex flex-col space-y-6">
                            <div className="border-t pt-4">
                                <h2 className="font-semibold text-lg text-slate-700 mb-2">1. Cargar Archivo</h2>
                                <input
                                    type="file"
                                    accept=".xlsx"
                                    onChange={onFileChange}
                                    className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {loading && <p className="text-blue-600 mt-2">Cargando y procesando clientes...</p>}
                                {fileError && <p className="text-red-600 mt-2 text-sm">{fileError}</p>}
                            </div>

                            <div className="border-t pt-4">
                                <h2 className="font-semibold text-lg text-slate-700 mb-2">2. Filtro por Proximidad</h2>
                                <div className="space-y-3">
                                    <button
                                        onClick={onSetCenterClick}
                                        className={`w-full px-4 py-2 rounded-md font-semibold text-white transition-colors ${isSettingCenter ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        {isSettingCenter ? 'Haz clic en el mapa...' : 'Establecer Punto de Referencia'}
                                    </button>
                                    <div>
                                        <label htmlFor="radius" className="block text-sm font-medium text-slate-600 mb-1">Radio (km)</label>
                                        <input
                                            id="radius"
                                            type="number"
                                            value={radiusKm}
                                            onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <button
                                        onClick={onFilterClick}
                                        disabled={!referencePoint}
                                        className="w-full px-4 py-2 bg-slate-700 text-white font-semibold rounded-md hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Aplicar Filtro
                                    </button>
                                </div>
                            </div>

                            <div className="border-t pt-4 flex-grow flex flex-col min-h-0">
                                <h2 className="font-semibold text-lg text-slate-700 mb-2">3. Resultados ({filteredClients.length})</h2>
                                <ul ref={resultListRef} className="flex-grow overflow-y-auto bg-slate-50 p-2 rounded-md space-y-2 h-64">
                                    {paginatedClients.length > 0 ? (
                                        paginatedClients.map(client => (
                                            <li
                                                key={client.id}
                                                id={`client-${client.id}`}
                                                onClick={() => onClientSelect(client)}
                                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClientSelect(client); }}
                                                role="button"
                                                tabIndex={0}
                                                className={`p-3 rounded-lg shadow-sm transition-all cursor-pointer ${selectedClientId === client.id ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white border hover:bg-slate-50'}`}
                                            >
                                                <h3 className="font-semibold text-slate-800">{client.name}</h3>
                                                <p className="text-sm text-slate-600">Tel: {client.phone}</p>
                                                <p className="text-sm text-slate-600">Consumo: {client.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                                                {client.distance !== undefined && (
                                                    <p className="text-sm font-medium text-blue-700 mt-1">
                                                        Distancia: {(client.distance / 1000).toFixed(2)} km
                                                    </p>
                                                )}
                                            </li>
                                        ))
                                    ) : (
                                        <li className="text-center text-slate-500 py-4">No se encontraron clientes.</li>
                                    )}
                                </ul>
                                {totalPages > 1 && (
                                    <div className="flex justify-between items-center pt-4 border-t mt-2">
                                        <button
                                            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Anterior
                                        </button>
                                        <span className="text-sm text-slate-600">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                                            disabled={currentPage === totalPages}
                                            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
