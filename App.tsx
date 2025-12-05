import React, { useState } from 'react';
import ConfigPanel from './components/ConfigPanel';
import DiagramCanvas from './components/DiagramCanvas';
import { EspConfig, INITIAL_CONFIG } from './types';

const App: React.FC = () => {
    const [config, setConfig] = useState<EspConfig>(INITIAL_CONFIG);

    return (
        <div className="flex h-screen w-screen overflow-hidden font-sans bg-[#f4f6f7] text-[#2c3e50]">
            {/* Sidebar Configuration Panel */}
            <ConfigPanel config={config} setConfig={setConfig} />

            {/* Main Content Area (Visualization) */}
            <DiagramCanvas config={config} />
        </div>
    );
};

export default App;