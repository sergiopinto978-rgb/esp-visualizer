
export type MotorType = 'AMM' | 'PMM';

export interface EspConfig {
    // Visualization
    zoom: number;
    
    // Surface
    surface: boolean;
    vsd: boolean;
    vsdFreq: number;
    
    // Well & Fluid
    fluidLevel: number; // Percentage 0-100 (Depth)
    fluidDensity: number;
    
    // Completion
    cableSize: number; // AWG Size indicator (inverse logic handled in UI/Display usually, but here 1=thickest for viz simplicity or standard index)
    packer: boolean;
    yTool: boolean;
    cableGuard: boolean;
    
    // Downhole Equipment
    motorType: MotorType;
    motorHp: number;
    stages: number; // affects pump length
    sensor: boolean;
}

export const INITIAL_CONFIG: EspConfig = {
    zoom: 1.0,
    surface: true,
    vsd: true,
    vsdFreq: 50,
    packer: false,
    yTool: false,
    motorType: "AMM",
    stages: 120,
    motorHp: 375,
    sensor: true,
    cableGuard: true,
    fluidLevel: 30,
    cableSize: 4,
    fluidDensity: 1.0
};
