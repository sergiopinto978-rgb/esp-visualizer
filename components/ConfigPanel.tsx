
import React from 'react';
import { EspConfig, MotorType } from '../types';

interface ConfigPanelProps {
    config: EspConfig;
    setConfig: React.Dispatch<React.SetStateAction<EspConfig>>;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, setConfig }) => {
    
    const update = (key: keyof EspConfig, value: any) => {
        setConfig(prev => {
            const next = { ...prev, [key]: value };
            
            // Handle mutual exclusivity
            if (key === 'packer' && value === true) next.yTool = false;
            if (key === 'yTool' && value === true) next.packer = false;
            
            return next;
        });
    };

    // Styling constants matching the requested "Pro" aesthetic
    const H2_STYLE = "mt-0 text-[1.1rem] uppercase tracking-wider text-[#2980b9] border-b-2 border-[#2980b9] pb-[10px] mb-[20px] font-bold";
    const SECTION_TITLE = "text-[0.8rem] font-bold text-[#7f8c8d] mt-[20px] mb-[10px] uppercase border-b border-[#eee] pb-[2px] tracking-wide";
    const LABEL_STYLE = "flex items-center justify-between text-[0.9rem] cursor-pointer text-[#34495e] font-medium";
    const VALUE_STYLE = "text-[0.85rem] text-[#2980b9] font-bold bg-blue-50 px-2 rounded";
    const RANGE_STYLE = "w-full mt-2 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2980b9] hover:accent-[#3498db]";
    const CHECKBOX_STYLE = "w-5 h-5 accent-[#2980b9] border-gray-300 rounded focus:ring-[#2980b9]";
    const SELECT_STYLE = "w-full p-2 mt-1 rounded border border-[#bdc3c7] bg-[#f8f9fa] text-sm text-[#2c3e50] focus:border-[#2980b9] focus:outline-none";

    return (
        <div className="w-[360px] bg-white border-r border-[#dcdcdc] p-[24px] flex flex-col overflow-y-auto shadow-[2px_0_15px_rgba(0,0,0,0.03)] z-10 shrink-0 h-full font-sans">
            <h2 className={H2_STYLE}>
                Configurador ESP Pro
            </h2>

            {/* Visualización */}
            <div className={SECTION_TITLE}>Visualización</div>
            <div className="mb-4">
                <label className={LABEL_STYLE}>
                    Zoom General
                    <span className={VALUE_STYLE}>{config.zoom}x</span>
                </label>
                <input 
                    type="range" min="0.6" max="1.4" step="0.1" 
                    value={config.zoom} 
                    onChange={(e) => update('zoom', parseFloat(e.target.value))}
                    className={RANGE_STYLE}
                />
            </div>

            {/* Superficie */}
            <div className={SECTION_TITLE}>Superficie & Energía</div>
            <div className="flex items-center justify-between mb-3 p-2 bg-slate-50 rounded hover:bg-slate-100 transition">
                <span className="text-sm font-medium text-[#34495e]">Mostrar Superficie (Cielo)</span>
                <input type="checkbox" checked={config.surface} onChange={(e) => update('surface', e.target.checked)} className={CHECKBOX_STYLE} />
            </div>
            <div className="flex items-center justify-between mb-3 p-2 bg-slate-50 rounded hover:bg-slate-100 transition">
                <span className="text-sm font-medium text-[#34495e]">Sistema VSD & Transformador</span>
                <input type="checkbox" checked={config.vsd} onChange={(e) => update('vsd', e.target.checked)} className={CHECKBOX_STYLE} />
            </div>
            
            {config.vsd && (
                <div className="mb-4 pl-2 border-l-2 border-[#2980b9] ml-1">
                    <label className={LABEL_STYLE}>
                        Frecuencia Operativa
                        <span className={VALUE_STYLE}>{config.vsdFreq} Hz</span>
                    </label>
                    <input 
                        type="range" min="30" max="90" step="1" 
                        value={config.vsdFreq} 
                        onChange={(e) => update('vsdFreq', parseInt(e.target.value))}
                        className={RANGE_STYLE}
                    />
                </div>
            )}

            {/* Pozo */}
            <div className={SECTION_TITLE}>Condiciones de Pozo</div>
            <div className="mb-4">
                <label className={LABEL_STYLE}>
                    Nivel de Fluido (Profundidad)
                    <span className={VALUE_STYLE}>{config.fluidLevel} %</span>
                </label>
                <input 
                    type="range" min="10" max="90" step="1" 
                    value={config.fluidLevel} 
                    onChange={(e) => update('fluidLevel', parseInt(e.target.value))}
                    className={RANGE_STYLE}
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>Superficie</span>
                    <span>Fondo</span>
                </div>
            </div>

            {/* Cable & Accesorios */}
            <div className={SECTION_TITLE}>Cable & Accesorios</div>
            <div className="mb-4">
                <label className={LABEL_STYLE}>
                    Calibre Cable Potencia
                    <span className={VALUE_STYLE}>AWG #{config.cableSize}</span>
                </label>
                <input 
                    type="range" min="1" max="6" step="1" 
                    value={config.cableSize} 
                    onChange={(e) => update('cableSize', parseInt(e.target.value))}
                    className={RANGE_STYLE}
                />
                <div className="text-[10px] text-gray-400 mt-1 text-right">Más grueso ← → Más delgado</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mb-2">
                <label className="flex flex-col items-center justify-center p-3 border rounded cursor-pointer hover:border-[#2980b9] transition bg-white">
                    <span className="text-xs font-bold mb-2">PACKER</span>
                    <input type="checkbox" checked={config.packer} onChange={(e) => update('packer', e.target.checked)} className={CHECKBOX_STYLE} />
                </label>
                <label className="flex flex-col items-center justify-center p-3 border rounded cursor-pointer hover:border-[#2980b9] transition bg-white">
                    <span className="text-xs font-bold mb-2">Y-TOOL</span>
                    <input type="checkbox" checked={config.yTool} onChange={(e) => update('yTool', e.target.checked)} className={CHECKBOX_STYLE} />
                </label>
            </div>
            
            <label className="flex items-center justify-between p-2 mt-2 border border-dashed border-gray-300 rounded hover:bg-slate-50">
                <span className="text-sm text-gray-600">Protectores de Cable (GLE)</span>
                <input type="checkbox" checked={config.cableGuard} onChange={(e) => update('cableGuard', e.target.checked)} className={CHECKBOX_STYLE} />
            </label>

            {/* Equipo de Fondo */}
            <div className={SECTION_TITLE}>Equipo de Fondo (BHA)</div>
            
            <div className="mb-4">
                <label className="block text-sm font-bold text-[#34495e] mb-1">Tecnología de Motor</label>
                <select 
                    value={config.motorType} 
                    onChange={(e) => update('motorType', e.target.value as MotorType)}
                    className={SELECT_STYLE}
                >
                    <option value="AMM">Asincrónico (Inducción) - AMM</option>
                    <option value="PMM">Imanes Permanentes - PMM</option>
                </select>
            </div>

            <div className="mb-4">
                <label className={LABEL_STYLE}>
                    Potencia Motor
                    <span className={VALUE_STYLE}>{config.motorHp} HP</span>
                </label>
                <input 
                    type="range" min="50" max="1000" step="25" 
                    value={config.motorHp} 
                    onChange={(e) => update('motorHp', parseInt(e.target.value))}
                    className={RANGE_STYLE}
                />
            </div>

            <div className="mb-4">
                <label className={LABEL_STYLE}>
                    Etapas de Bomba
                    <span className={VALUE_STYLE}>{config.stages} stgs</span>
                </label>
                <input 
                    type="range" min="20" max="400" step="10" 
                    value={config.stages} 
                    onChange={(e) => update('stages', parseInt(e.target.value))}
                    className={RANGE_STYLE}
                />
            </div>

            <label className="flex items-center justify-between p-3 bg-[#e8f6f3] border border-[#d4efdf] rounded text-[#27ae60] font-bold cursor-pointer">
                <span>Sensor de Fondo (Downhole Gauge)</span>
                <input type="checkbox" checked={config.sensor} onChange={(e) => update('sensor', e.target.checked)} className={CHECKBOX_STYLE} />
            </label>
            
            <div className="mt-8 pt-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-400">ESP Technical Pro v2.0</p>
            </div>
        </div>
    );
};

export default ConfigPanel;
