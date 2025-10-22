import React, { useState, useRef } from 'react';
import { useClientDataManager } from '../../hooks/useClientDataManager';
import ClientList from './ClientList';
import Pagination from './Pagination';

interface PotencialesControlsProps {
    isDatabaseUnlocked: boolean;
    isSettingCenter: boolean;
    onSetCenterClick: () => void;
    clientDataManager: ReturnType<typeof useClientDataManager>;
}

const PotencialesControls: React.FC<PotencialesControlsProps> = ({
    isDatabaseUnlocked,
    isSettingCenter,
    onSetCenterClick,
    clientDataManager,
}) => {
    const {
        clients,
        fileError,
        handleFile,
        finalFilteredClients,
        paginatedClients,
        totalPages,
        currentPage,
        onPageChange,
        selectedClientId,
        handleClientSelect,
        handleExport,
        radiusMeters,
        onRadiusChange,
        showOnlyNewClients,
        onShowOnlyNewClientsChange,
    } = clientDataManager;

    const [exportOption, setExportOption] = useState<'all' | 'filtered'>('all');
    const resultListRef = useRef<HTMLUListElement>(null);
    const isFiltered = clients.length > 0 && clients.length !== finalFilteredClients.length;

    if (!isDatabaseUnlocked) {
        return (
            <div className="p-6">
                <div className="p-4 text-center bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
                    <p className="font-semibold text-yellow-800 dark:text-yellow-300">Sección Bloqueada</p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        Por favor, configure la clave de API para desbloquear estas opciones.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 flex flex-col space-y-6">
            <fieldset className="space-y-6">
                <div className="border-t pt-4 dark:border-slate-700">
                    <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">1. Cargar Archivo</h2>
                    <input
                        type="file"
                        accept=".xlsx"
                        onChange={handleFile}
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
                    <h2 className="font-semibold text-lg text-slate-700 dark:text-slate-200 mb-2">3. Resultados ({finalFilteredClients.length})</h2>
                    <ul ref={resultListRef} className="flex-grow overflow-y-auto bg-slate-50 dark:bg-slate-900/50 p-2 rounded-md space-y-2 h-64">
                       <ClientList paginatedClients={paginatedClients} selectedClientId={selectedClientId} onClientSelect={handleClientSelect} />
                    </ul>
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
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
                                Exportar solo filtrados ({finalFilteredClients.length})
                            </label>
                        </div>
                    </div>
                    <button
                        onClick={() => handleExport(exportOption)}
                        disabled={clients.length === 0}
                        className="w-full px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
                    >
                        Exportar a Excel
                    </button>
                </div>
            </fieldset>
        </div>
    );
};

export default PotencialesControls;
