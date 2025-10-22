import React, { useRef, useState } from 'react';
import { Client } from '../types';

type View = 'inicio' | 'calculadora' | 'potenciales' | 'nosotros';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeView: View;
    onNavClick: (view: View) => void;
    isDatabaseUnlocked: boolean;
    onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    fileError: string;
    isSettingCenter: boolean;
    onSetCenterClick: () => void;
    radiusMeters: number;
    onRadiusChange: (value: number) => void;
    onExport: (exportType: 'all' | 'filtered') => void;
    referencePoint: any;
    clients: Client[];
    filteredClients: Client[];
    paginatedClients: Client[];
    selectedClientId: string | null;
    onClientSelect: (client: Client | null) => void;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
    showOnlyNewClients: boolean;
    onShowOnlyNewClientsChange: (checked: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    isOpen,
    onClose,
    activeView,
    onNavClick,
    isDatabaseUnlocked,
    onFileChange,
    loading,
    fileError,
    isSettingCenter,
    onSetCenterClick,
    radiusMeters,
    onRadiusChange,
    onExport,
    referencePoint,
    clients,
    filteredClients,
    paginatedClients,
    selectedClientId,
    onClientSelect,
    totalPages,
    currentPage,
    onPageChange,
    showOnlyNewClients,
    onShowOnlyNewClientsChange
}) => {
    const resultListRef = useRef<HTMLUListElement>(null);
    const [exportOption, setExportOption] = useState<'all' | 'filtered'>('all');
    
    const isFiltered = clients.length > 0 && clients.length !== filteredClients.length;

    return (
        <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            <div className={`relative w-full max-w-sm bg-white dark:bg-slate-800 h-full shadow-xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white">Menú</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700" aria-label="Cerrar menú">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="overflow-y-auto h-[calc(100vh-65px)]">
                    <nav className="p-4 border-b dark:border-slate-700">
                        <ul>
                             <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('inicio'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'inicio' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    Inicio
                                </a>
                            </li>
                             <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('calculadora'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'calculadora' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    Calculadora Solar
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('potenciales'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'potenciales' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    Base De Datos
                                </a>
                            </li>
                            <li>
                                <a href="#" onClick={(e) => { e.preventDefault(); onNavClick('nosotros'); onClose(); }} className={`flex items-center p-3 rounded-lg font-semibold ${activeView === 'nosotros' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                                    Nosotros
                                </a>
                            </li>
                        </ul>
                    </nav>
                    
                    {activeView === 'potenciales' && (
                       <div className="p-6 flex flex-col space-y-6">
                            {!isDatabaseUnlocked && (
                                <div className="p-4 text-center bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
                                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">Sección Bloqueada</p>
                                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                                        Por favor, configure la clave de API para desbloquear estas opciones.
                                    </p>
                                </div>
                            )}
                            <fieldset disabled={!isDatabaseUnlocked} className="space-y-6 disabled:opacity-50 disabled:pointer-events-none">
                                <div className="border-t pt-4 dark:border-slate-700">
                                    <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">1. Cargar Archivo</h2>
                                    <input
                                        type="file"
                                        accept=".xlsx"
                                        onChange={onFileChange}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-400 dark:file:bg-blue-900/50 dark:file:text-blue-300 dark:hover:file:bg-blue-900"
                                    />
                                    {fileError && <p className="text-red-600 mt-2 text-sm">{fileError}</p>}
                                </div>

                                <div className="border-t pt-4 dark:border-slate-700">
                                    <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">2. Filtros</h2>
                                    <div className="space-y-3">
                                        <button
                                            onClick={onSetCenterClick}
                                            className={`w-full px-4 py-2 rounded-md font-semibold text-white transition-colors ${isSettingCenter ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'}`}
                                        >
                                            {isSettingCenter ? 'Haz clic en el mapa...' : 'Establecer Punto de Referencia'}
                                        </button>
                                        <div>
                                            <label htmlFor="radius" className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Radio (m)</label>
                                            <input
                                                id="radius"
                                                type="number"
                                                value={radiusMeters}
                                                onChange={(e) => onRadiusChange(parseFloat(e.target.value))}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200"
                                            />
                                        </div>
                                        <div className="relative flex items-start">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="new-clients-filter"
                                                    name="new-clients-filter"
                                                    type="checkbox"
                                                    checked={showOnlyNewClients}
                                                    onChange={(e) => onShowOnlyNewClientsChange(e.target.checked)}
                                                    className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded dark:bg-slate-600 dark:border-slate-500"
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="new-clients-filter" className="font-medium text-slate-700 dark:text-slate-300">
                                                    Mostrar solo clientes no vistos
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4 flex-grow flex flex-col min-h-0 dark:border-slate-700">
                                    <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">3. Resultados ({filteredClients.length})</h2>
                                    <ul ref={resultListRef} className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md space-y-2 h-64">
                                        {paginatedClients.length > 0 ? (
                                            paginatedClients.map(client => (
                                                <li
                                                    key={client.id}
                                                    id={`client-${client.id}`}
                                                    onClick={() => onClientSelect(client)}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onClientSelect(client); }}
                                                    role="button"
                                                    tabIndex={0}
                                                    className={`p-3 rounded-lg shadow-sm transition-all cursor-pointer ${selectedClientId === client.id ? 'bg-blue-100 border-2 border-blue-400 dark:bg-blue-900/50 dark:border-blue-500' : 'bg-white dark:bg-slate-700/50 border dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
                                                >
                                                    <h3 className="font-semibold text-slate-800 dark:text-slate-100">{client.name}</h3>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Tel: {client.phone}</p>
                                                    <p className="text-sm text-slate-600 dark:text-slate-400">Consumo: {client.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' })}</p>
                                                    {client.distance !== undefined && (
                                                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400 mt-1">
                                                            Distancia: {(client.distance / 1000).toFixed(2)} km
                                                        </p>
                                                    )}
                                                </li>
                                            ))
                                        ) : (
                                            <li className="text-center text-slate-500 dark:text-slate-400 py-4">No se encontraron clientes.</li>
                                        )}
                                    </ul>
                                    {totalPages > 1 && (
                                        <div className="flex justify-between items-center pt-4 border-t mt-2 dark:border-slate-700">
                                            <button
                                                onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600"
                                            >
                                                Anterior
                                            </button>
                                            <span className="text-sm text-slate-600 dark:text-slate-400">
                                                Página {currentPage} de {totalPages}
                                            </span>
                                            <button
                                                onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-600"
                                            >
                                                Siguiente
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t pt-4 dark:border-slate-700">
                                    <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">4. Guardar Cambios</h2>
                                    <div className="space-y-2 mb-4">
                                        <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">Opciones de Exportación:</label>
                                        <div className="flex items-center">
                                            <input
                                                id="export-all"
                                                name="export-option"
                                                type="radio"
                                                value="all"
                                                checked={exportOption === 'all'}
                                                onChange={() => setExportOption('all')}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 dark:bg-slate-600 dark:border-slate-500"
                                            />
                                            <label htmlFor="export-all" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">
                                                Exportar todos los clientes ({clients.length})
                                            </label>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                id="export-filtered"
                                                name="export-option"
                                                type="radio"
                                                value="filtered"
                                                checked={exportOption === 'filtered'}
                                                onChange={() => setExportOption('filtered')}
                                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 dark:bg-slate-600 dark:border-slate-500"
                                                disabled={!isFiltered}
                                            />
                                            <label htmlFor="export-filtered" className={`ml-2 block text-sm ${isFiltered ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                                                Exportar solo filtrados ({filteredClients.length})
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onExport(exportOption)}
                                        disabled={clients.length === 0}
                                        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Exportar a Excel
                                    </button>
                                </div>
                            </fieldset>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;