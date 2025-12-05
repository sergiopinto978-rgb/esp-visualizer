
import React from 'react';
import { EspConfig } from '../types';

interface DiagramCanvasProps {
    config: EspConfig;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ config }) => {
    const {
        zoom, surface, vsd, vsdFreq, fluidLevel, 
        cableSize, packer, yTool, cableGuard,
        motorType, motorHp, stages, sensor, fluidDensity
    } = config;

    // --- CONFIGURATION CONSTANTS ---
    const BASE_WIDTH = 950;
    const WELL_X = 350;
    const LABEL_X_START = 600;
    
    // Widths (px)
    const CASING_WIDTH = 200;
    const CEMENT_WIDTH = 20; // Extra width outside casing
    const TUBING_WIDTH = 26;
    const ESP_WIDTH = 50;
    
    // Scale Factors
    // PMM motors are generally shorter and more power dense than AMM
    const HP_FACTOR = motorType === "PMM" ? 0.25 : 0.45; 
    
    // Heights (px)
    const MOTOR_H = Math.max(90, motorHp * HP_FACTOR);
    const PUMP_H = Math.max(120, stages * 1.5);
    const INTAKE_H = 50;
    const SEAL_H = 70;
    const SENSOR_H = 35;
    
    const SURFACE_H = surface ? 350 : 60; // Space for sky/surface equipment
    const TUBING_LEN = 450;
    
    const ESP_START_Y = SURFACE_H + TUBING_LEN;
    const PUMP_Y = ESP_START_Y;
    const INTAKE_Y = PUMP_Y + PUMP_H;
    const SEAL_Y = INTAKE_Y + INTAKE_H;
    const MOTOR_Y = SEAL_Y + SEAL_H;
    const SENSOR_Y = MOTOR_Y + MOTOR_H;
    
    const ESP_BOTTOM_Y = sensor ? SENSOR_Y + SENSOR_H : MOTOR_Y + MOTOR_H;
    const RAT_HOLE = 150;
    const TOTAL_HEIGHT = ESP_BOTTOM_Y + RAT_HOLE + 100;

    const PERF_Y = TOTAL_HEIGHT - 180;
    
    // Fluid Calculation
    // fluidLevel is 0% (at surface) to 100% (at bottom) - technically "Submergence" is usually opposite, 
    // but assuming user input means "Level Depth %"
    const FLUID_Y = SURFACE_H + ((TOTAL_HEIGHT - SURFACE_H) * (fluidLevel / 100));

    // --- HELPER RENDERS ---

    const renderLabel = (y: number, title: string, subtitle?: string) => (
        <g className="transition-all duration-300">
            {/* Connector Line */}
            <path d={`M${WELL_X + 60} ${y} L${LABEL_X_START - 20} ${y} L${LABEL_X_START} ${y}`} 
                  stroke="#2c3e50" strokeWidth="1" strokeDasharray="2,2" opacity="0.6" />
            <circle cx={WELL_X + 60} cy={y} r="3" fill="#2c3e50" />
            
            {/* Label Box */}
            <g transform={`translate(${LABEL_X_START}, ${y - 18})`}>
                <rect width="240" height={subtitle ? "36" : "24"} rx="4" 
                      fill="rgba(255,255,255,0.9)" stroke="#bdc3c7" strokeWidth="1" 
                      className="shadow-sm"/>
                <rect width="4" height={subtitle ? "36" : "24"} rx="2" fill="#3498db" />
                <text x="12" y="16" fontSize="13" fontWeight="bold" fill="#2c3e50" fontFamily="sans-serif">
                    {title}
                </text>
                {subtitle && (
                    <text x="12" y="30" fontSize="10" fill="#7f8c8d" fontFamily="monospace">
                        {subtitle}
                    </text>
                )}
            </g>
        </g>
    );

    return (
        <div className="flex-grow bg-[#e0e5ec] flex justify-center overflow-auto relative p-8"
             style={{
                 backgroundImage: 'radial-gradient(#cfd8dc 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
             }}>
            
            <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }} 
                 className="origin-top">
                
                <svg width={BASE_WIDTH} height={TOTAL_HEIGHT} className="bg-white shadow-2xl rounded-lg overflow-hidden ring-1 ring-slate-200">
                    <defs>
                        {/* Metal Gradient */}
                        <linearGradient id="gradMetal" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#95a5a6"/>
                            <stop offset="30%" stopColor="#ecf0f1"/>
                            <stop offset="50%" stopColor="#bdc3c7"/>
                            <stop offset="70%" stopColor="#ecf0f1"/>
                            <stop offset="100%" stopColor="#95a5a6"/>
                        </linearGradient>
                        
                        {/* Sky Gradient */}
                        <linearGradient id="gradSky" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3498db" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="#ecf0f1" stopOpacity="0.1"/>
                        </linearGradient>

                        {/* Fluid Gradient */}
                        <linearGradient id="gradFluid" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgba(52, 152, 219, 0.4)"/>
                            <stop offset="50%" stopColor="rgba(52, 152, 219, 0.2)"/>
                            <stop offset="100%" stopColor="rgba(52, 152, 219, 0.4)"/>
                        </linearGradient>

                        {/* Ground Pattern */}
                        <pattern id="patGround" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                             <path d="M0 20 L20 0 M5 25 L25 5 M-5 15 L15 -5" stroke="#aab7b8" strokeWidth="1"/>
                        </pattern>

                        {/* Cement Pattern */}
                        <pattern id="patCement" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
                            <rect width="5" height="5" fill="#bdc3c7" opacity="0.3"/>
                            <circle cx="2" cy="2" r="0.5" fill="#7f8c8d"/>
                        </pattern>

                        <filter id="dropShadow">
                            <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
                            <feOffset dx="2" dy="2" result="offsetblur"/>
                            <feComponentTransfer>
                                <feFuncA type="linear" slope="0.3"/>
                            </feComponentTransfer>
                            <feMerge> 
                                <feMergeNode/>
                                <feMergeNode in="SourceGraphic"/> 
                            </feMerge>
                        </filter>
                    </defs>

                    {/* ================= ENVIRONMENT ================= */}
                    
                    {/* Sky */}
                    {surface && (
                        <rect x="0" y="0" width={BASE_WIDTH} height={SURFACE_H} fill="url(#gradSky)" />
                    )}

                    {/* Ground / Subsurface */}
                    <rect x="0" y={SURFACE_H} width={BASE_WIDTH} height={TOTAL_HEIGHT - SURFACE_H} fill="#f4f6f7" />
                    <rect x="0" y={SURFACE_H} width={BASE_WIDTH} height={TOTAL_HEIGHT - SURFACE_H} fill="url(#patGround)" opacity="0.3" />
                    
                    {/* Ground Line */}
                    <line x1="0" y1={SURFACE_H} x2={BASE_WIDTH} y2={SURFACE_H} stroke="#7f8c8d" strokeWidth="4" />
                    {surface && <text x="20" y={SURFACE_H - 10} fill="#7f8c8d" fontSize="12" fontWeight="bold">NIVEL SUPERFICIE</text>}


                    {/* ================= WELLBORE ================= */}

                    {/* Cement Sheath */}
                    <rect x={WELL_X - CASING_WIDTH/2 - CEMENT_WIDTH} y={SURFACE_H} 
                          width={CASING_WIDTH + CEMENT_WIDTH*2} height={TOTAL_HEIGHT - SURFACE_H} 
                          fill="url(#patCement)" />

                    {/* Casing Interior */}
                    <rect x={WELL_X - CASING_WIDTH/2} y={SURFACE_H} 
                          width={CASING_WIDTH} height={TOTAL_HEIGHT - SURFACE_H} 
                          fill="#ffffff" stroke="none" />
                    
                    {/* Fluid Level */}
                    <rect x={WELL_X - CASING_WIDTH/2 + 2} y={FLUID_Y} 
                          width={CASING_WIDTH - 4} height={TOTAL_HEIGHT - FLUID_Y} 
                          fill="url(#gradFluid)" />
                    {/* Fluid Surface Line */}
                    <line x1={WELL_X - CASING_WIDTH/2} y1={FLUID_Y} x2={WELL_X + CASING_WIDTH/2} y2={FLUID_Y} 
                          stroke="#3498db" strokeWidth="2" strokeDasharray="4,2"/>
                    <text x={WELL_X + CASING_WIDTH/2 + 10} y={FLUID_Y + 4} fill="#3498db" fontSize="11" fontWeight="bold">
                        Nivel Dinámico ({fluidLevel}%)
                    </text>

                    {/* Casing Walls */}
                    <line x1={WELL_X - CASING_WIDTH/2} y1={SURFACE_H} x2={WELL_X - CASING_WIDTH/2} y2={TOTAL_HEIGHT} stroke="#2c3e50" strokeWidth="6" />
                    <line x1={WELL_X + CASING_WIDTH/2} y1={SURFACE_H} x2={WELL_X + CASING_WIDTH/2} y2={TOTAL_HEIGHT} stroke="#2c3e50" strokeWidth="6" />
                    
                    {/* Perforations */}
                    <g transform={`translate(${WELL_X}, ${PERF_Y})`}>
                        {[0, 40, 80].map((offset) => (
                            <React.Fragment key={offset}>
                                {/* Left Perfs */}
                                <polygon points={`-${CASING_WIDTH/2} ${offset} -${CASING_WIDTH/2 + 20} ${offset+10} -${CASING_WIDTH/2} ${offset+20}`} fill="#2c3e50" />
                                {/* Right Perfs */}
                                <polygon points={`${CASING_WIDTH/2} ${offset+20} ${CASING_WIDTH/2 + 20} ${offset+30} ${CASING_WIDTH/2} ${offset+40}`} fill="#2c3e50" />
                            </React.Fragment>
                        ))}
                    </g>
                    
                    {/* Rat Hole Fill */}
                    <rect x={WELL_X - CASING_WIDTH/2} y={TOTAL_HEIGHT - RAT_HOLE + 20} width={CASING_WIDTH} height={RAT_HOLE - 20} fill="#5d4037" opacity="0.6"/>

                    {/* ================= SURFACE EQUIPMENT ================= */}
                    
                    {surface && (
                        <g>
                            {/* Wellhead Base */}
                            <rect x={WELL_X - 60} y={SURFACE_H - 40} width={120} height={40} fill="#546e7a" stroke="#2c3e50" strokeWidth="2" />
                            <path d={`M${WELL_X - 70} ${SURFACE_H} L${WELL_X + 70} ${SURFACE_H} L${WELL_X + 60} ${SURFACE_H - 10} L${WELL_X - 60} ${SURFACE_H - 10} Z`} fill="#37474f" />

                            {/* Christmas Tree */}
                            <rect x={WELL_X - 20} y={SURFACE_H - 140} width={40} height={100} fill="#607d8b" stroke="#2c3e50" strokeWidth="2" />
                            {/* Valves */}
                            <circle cx={WELL_X} cy={SURFACE_H - 150} r="15" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
                            <rect x={WELL_X - 80} y={SURFACE_H - 100} width={60} height={20} fill="#607d8b" stroke="#2c3e50" strokeWidth="2" />
                            <circle cx={WELL_X - 90} cy={SURFACE_H - 90} r="12" fill="#e74c3c" stroke="#c0392b" strokeWidth="2" />
                        </g>
                    )}

                    {surface && vsd && (
                        <g transform={`translate(80, ${SURFACE_H - 160})`}>
                            {/* TRANSFORMER */}
                            <g transform="translate(0, 40)">
                                <rect x="0" y="20" width="70" height="80" fill="#78909c" stroke="#455a64" strokeWidth="2" rx="2" />
                                {/* Cooling Fins */}
                                {[10, 20, 30, 40, 50, 60].map(x => (
                                    <line key={x} x1={x} y1="22" x2={x} y2="98" stroke="#546e7a" strokeWidth="1" />
                                ))}
                                {/* Bushings */}
                                <rect x="15" y="0" width="10" height="20" fill="#3e2723" />
                                <rect x="45" y="0" width="10" height="20" fill="#3e2723" />
                                <text x="35" y="115" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2c3e50">TRAFO</text>
                            </g>

                            {/* CABLES: Trafo -> VSD */}
                            <path d="M70 70 L100 70" stroke="#34495e" strokeWidth="4" strokeLinecap="round" />

                            {/* VSD CABINET */}
                            <g transform="translate(100, 0)">
                                <rect x="0" y="0" width="90" height="140" fill="#f5f5f5" stroke="#2c3e50" strokeWidth="2" rx="2" />
                                {/* Screen */}
                                <rect x="10" y="20" width="70" height="40" fill="#34495e" stroke="#2c3e50" />
                                <text x="45" y="45" textAnchor="middle" fill="#2ecc71" fontFamily="monospace" fontSize="14" fontWeight="bold">
                                    {vsdFreq.toFixed(1)} Hz
                                </text>
                                {/* Buttons/Controls */}
                                <circle cx="25" cy="80" r="5" fill="#e74c3c" />
                                <circle cx="45" cy="80" r="5" fill="#f1c40f" />
                                <circle cx="65" cy="80" r="5" fill="#2ecc71" />
                                {/* Vents */}
                                <line x1="10" y1="110" x2="80" y2="110" stroke="#bdc3c7" strokeWidth="2" />
                                <line x1="10" y1="116" x2="80" y2="116" stroke="#bdc3c7" strokeWidth="2" />
                                <text x="45" y="135" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2c3e50">VSD</text>
                            </g>
                            
                            {/* POWER CABLE: VSD -> Wellhead */}
                            <path d={`M190 70 L240 70 L240 160`} stroke="#e74c3c" strokeWidth={Math.max(2, cableSize * 0.8)} fill="none" />
                        </g>
                    )}

                    {/* ================= DOWNHOLE COMPLETION ================= */}

                    {/* TUBING */}
                    <rect x={WELL_X - TUBING_WIDTH/2} y={SURFACE_H} width={TUBING_WIDTH} height={TUBING_LEN} 
                          fill="url(#gradMetal)" stroke="#555" strokeWidth="1" />
                    
                    {/* Tubing Couplings */}
                    {[1, 2, 3, 4].map(i => (
                         <rect key={i} x={WELL_X - TUBING_WIDTH/2 - 2} y={SURFACE_H + (i * 100)} 
                               width={TUBING_WIDTH + 4} height="8" fill="#546e7a" stroke="#2c3e50" />
                    ))}

                    {/* POWER CABLE */}
                    <line x1={WELL_X + TUBING_WIDTH/2 + 4} y1={SURFACE_H} 
                          x2={WELL_X + TUBING_WIDTH/2 + 4} y2={MOTOR_Y + 10} 
                          stroke="#c0392b" strokeWidth={4 + (cableSize * 0.8)} strokeLinecap="round" />
                    
                    {/* Cable Guards / Clamps */}
                    {cableGuard && [0, 1, 2, 3, 4].map(i => {
                        const y = ESP_START_Y - 50 - (i * 80);
                        if (y > SURFACE_H) 
                        return <rect key={i} x={WELL_X + TUBING_WIDTH/2 - 2} y={y} width="12" height="20" fill="#2c3e50" rx="2" />;
                        return null;
                    })}

                    {/* PACKER */}
                    {packer && (
                        <g transform={`translate(${WELL_X}, ${ESP_START_Y - 80})`}>
                            <rect x={-CASING_WIDTH/2 + 5} y="0" width={CASING_WIDTH - 10} height="40" fill="#333" rx="4" filter="url(#dropShadow)"/>
                            <rect x="-15" y="-10" width="30" height="60" fill="url(#gradMetal)" />
                            {renderLabel(ESP_START_Y - 60, "Production Packer")}
                        </g>
                    )}

                    {/* Y-TOOL */}
                    {yTool && (
                        <g transform={`translate(${WELL_X}, ${ESP_START_Y - 180})`}>
                            <path d="M-20 0 L20 0 L40 120 L-40 120 Z" fill="url(#gradMetal)" stroke="#333" />
                            {/* Bypass Tubing */}
                            <rect x="40" y="0" width="20" height="250" fill="url(#gradMetal)" stroke="#333" />
                            {renderLabel(ESP_START_Y - 100, "Y-Tool System", "Bypass Configuration")}
                        </g>
                    )}

                    {/* ================= ESP STRING ================= */}
                    
                    <g transform={`translate(${WELL_X}, 0)`} filter="url(#dropShadow)">
                        
                        {/* 1. DISCHARGE / PUMP */}
                        <g transform={`translate(0, ${PUMP_Y})`}>
                            <rect x={-ESP_WIDTH/2} y="0" width={ESP_WIDTH} height={PUMP_H} fill="url(#gradMetal)" stroke="#333" />
                            {/* Stages Lines */}
                            {Array.from({length: Math.min(20, Math.floor(stages/5))}).map((_, i) => (
                                <line key={i} x1={-ESP_WIDTH/2} y1={10 + i * (PUMP_H/20)} x2={ESP_WIDTH/2} y2={10 + i * (PUMP_H/20)} stroke="#7f8c8d" opacity="0.5" />
                            ))}
                            <text x="0" y={PUMP_H/2} transform={`rotate(-90 0 ${PUMP_H/2})`} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#333" letterSpacing="1">
                                CENTRIFUGAL PUMP
                            </text>
                        </g>

                        {/* 2. INTAKE */}
                        <g transform={`translate(0, ${INTAKE_Y})`}>
                            <rect x={-ESP_WIDTH/2 + 2} y="0" width={ESP_WIDTH - 4} height={INTAKE_H} fill="#b0bec5" stroke="#333" />
                            {/* Intake Mesh/Slots */}
                            <defs>
                                <pattern id="patMesh" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                                    <circle cx="2" cy="2" r="1" fill="#333" />
                                </pattern>
                            </defs>
                            <rect x={-ESP_WIDTH/2 + 6} y="5" width={ESP_WIDTH - 12} height={INTAKE_H - 10} fill="url(#patMesh)" />
                        </g>

                        {/* 3. SEAL / PROTECTOR */}
                        <g transform={`translate(0, ${SEAL_Y})`}>
                            <rect x={-ESP_WIDTH/2 + 3} y="0" width={ESP_WIDTH - 6} height={SEAL_H} fill="url(#gradMetal)" stroke="#333" />
                            <text x="0" y={SEAL_H/2} transform={`rotate(-90 0 ${SEAL_H/2})`} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#555">PROTECTOR</text>
                        </g>

                        {/* 4. MOTOR */}
                        <g transform={`translate(0, ${MOTOR_Y})`}>
                            <rect x={-ESP_WIDTH/2} y="0" width={ESP_WIDTH} height={MOTOR_H} fill="#546e7a" stroke="#333" />
                            {/* Motor Fins - Visual difference */}
                            {motorType === "AMM" ? (
                                // AMM: Smooth with simple lines
                                <line x1="0" y1="0" x2="0" y2={MOTOR_H} stroke="#37474f" strokeWidth="20" opacity="0.3"/>
                            ) : (
                                // PMM: Ribbed look
                                Array.from({length: 10}).map((_,i) => (
                                    <rect key={i} x={-ESP_WIDTH/2} y={i*(MOTOR_H/10)} width={ESP_WIDTH} height="2" fill="#2c3e50" opacity="0.3"/>
                                ))
                            )}
                            <text x="0" y={MOTOR_H/2} transform={`rotate(-90 0 ${MOTOR_H/2})`} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
                                {motorType} MOTOR
                            </text>
                            {/* Pothead Connection */}
                            <rect x={ESP_WIDTH/2 - 5} y="10" width="15" height="20" fill="#333" />
                        </g>

                        {/* 5. SENSOR */}
                        {sensor && (
                            <g transform={`translate(0, ${SENSOR_Y})`}>
                                <rect x={-ESP_WIDTH/2 + 10} y="0" width={ESP_WIDTH - 20} height={SENSOR_H} fill="#d35400" stroke="#a04000" rx="5" />
                                <text x="0" y={SENSOR_H/2 + 4} textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">SENSOR</text>
                            </g>
                        )}
                    </g>

                    {/* ================= LABELS ================= */}
                    
                    {renderLabel(PUMP_Y + PUMP_H/2, `Bomba ${stages} Etapas`, "Centrífuga Multietapa")}
                    {renderLabel(INTAKE_Y + INTAKE_H/2, "Intake / Separador", "Entrada de Fluido")}
                    {renderLabel(SEAL_Y + SEAL_H/2, "Sección de Sello", "Protector de Motor")}
                    {renderLabel(MOTOR_Y + MOTOR_H/2, `Motor ${motorType} ${motorHp} HP`, motorType === "PMM" ? "Imanes Permanentes" : "Asincrónico")}
                    {sensor && renderLabel(SENSOR_Y + SENSOR_H/2, "Sensor de Fondo", "Presión/Temp/Vibración")}
                    
                    {/* Bottom Hole Info */}
                    <text x={WELL_X + CASING_WIDTH/2 + 10} y={PERF_Y + 40} fill="#2c3e50" fontSize="12" fontWeight="bold">Zona de Disparos</text>

                </svg>
            </div>
        </div>
    );
};

export default DiagramCanvas;
