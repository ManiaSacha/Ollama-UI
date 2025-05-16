import React from 'react';
import { Thermometer } from 'lucide-react';

interface TemperatureControlProps {
  temperature: number;
  setTemperature: (temp: number) => void;
}

const TemperatureControl: React.FC<TemperatureControlProps> = ({
  temperature,
  setTemperature,
}) => {
  // Calculate background gradient for the slider based on temperature
  const getGradient = () => {
    const blue = 'rgb(49, 130, 206)';
    const red = 'rgb(245, 101, 101)';
    return `linear-gradient(to right, ${blue}, ${red})`;
  };

  // Calculate label text based on temperature range
  const getTemperatureLabel = () => {
    if (temperature < 0.3) return 'Conservative';
    if (temperature < 0.7) return 'Balanced';
    return 'Creative';
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <label 
          htmlFor="temperature-slider" 
          className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300"
        >
          <Thermometer className="h-4 w-4 mr-1" />
          Temperature: {temperature.toFixed(1)}
        </label>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {getTemperatureLabel()}
        </span>
      </div>
      
      <div className="relative">
        <input
          id="temperature-slider"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-slate-200 dark:bg-slate-700 
            focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
          style={{ background: getGradient() }}
        />
      </div>
    </div>
  );
};

export default TemperatureControl;