import React from 'react';

interface SectionProps {
    title: string;
    children: React.ReactNode;
}

export const ConfigSection: React.FC<SectionProps> = ({ title, children }) => (
    <div className="mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b border-slate-200 pb-1">
            {title}
        </h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

interface RangeProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit?: string;
    onChange: (val: number) => void;
}

export const RangeControl: React.FC<RangeProps> = ({ label, value, min, max, step = 1, unit = "", onChange }) => (
    <div className="flex flex-col">
        <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {value} {unit}
            </span>
        </div>
        <input 
            type="range" 
            min={min} 
            max={max} 
            step={step} 
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
    </div>
);

interface ToggleProps {
    label: string;
    checked: boolean;
    onChange: (val: boolean) => void;
}

export const ToggleControl: React.FC<ToggleProps> = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between group cursor-pointer" onClick={() => onChange(!checked)}>
        <label className="text-sm font-medium text-slate-700 group-hover:text-slate-900 cursor-pointer">{label}</label>
        <div className={`w-10 h-5 flex items-center bg-slate-300 rounded-full p-1 duration-300 ease-in-out ${checked ? 'bg-blue-600' : ''}`}>
            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform duration-300 ease-in-out ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
    </div>
);

interface SelectProps {
    label: string;
    value: string;
    options: { label: string; value: string }[];
    onChange: (val: string) => void;
}

export const SelectControl: React.FC<SelectProps> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
        <select 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-full text-sm border-slate-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 bg-white py-2 px-3 border"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    </div>
);