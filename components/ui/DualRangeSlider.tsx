interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  step?: number;
  onChange: (value: [number, number]) => void;
  formatValue?: (value: number) => string;
  prefix?: string; 
}

export default function DualRangeSlider({
  min,
  max,
  value,
  step = 1,
  onChange,
  formatValue = (val) => val.toLocaleString(),
  prefix = "₦", // Default to Naira symbol for price
}: DualRangeSliderProps) {
  const getPercentage = (value: number) => ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div className="relative h-6">
        {/* Background track */}
        <div 
          className="absolute w-full h-1.5 bg-gray-200 rounded-full top-1/2 transform -translate-y-1/2"
        />
        
        {/* Active track */}
        <div
          className="absolute h-1.5 bg-orange-500 rounded-full top-1/2 transform -translate-y-1/2"
          style={{
            left: `${getPercentage(value[0])}%`,
            width: `${getPercentage(value[1]) - getPercentage(value[0])}%`,
          }}
        />

        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[0]}
          onChange={(e) => {
            const newMin = Math.min(Number(e.target.value), value[1]);
            onChange([newMin, value[1]]);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none top-1/2 transform -translate-y-1/2 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
        />

        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value[1]}
          onChange={(e) => {
            const newMax = Math.max(Number(e.target.value), value[0]);
            onChange([value[0], newMax]);
          }}
          className="absolute w-full appearance-none bg-transparent pointer-events-none top-1/2 transform -translate-y-1/2 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-orange-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-orange-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:shadow-md"
        />
      </div>

      {/* Values display */}
      <div className="flex justify-between text-sm text-gray-600 mt-4">
        <span>{prefix}{formatValue(value[0])}</span>
        <span>{prefix}{formatValue(value[1])}</span>
      </div>
    </div>
  );
}