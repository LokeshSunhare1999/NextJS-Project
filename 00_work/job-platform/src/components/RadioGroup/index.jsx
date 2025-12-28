import { useState } from "react";

export default function RadioGroup({ name, options, value, onChange }) {
  const [selected, setSelected] = useState(value);

  const handleChange = (val) => {
    setSelected(val);
    if (onChange) onChange(val);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center space-x-4 gap-3 flex-wrap">
      {options?.map((option) => (
        <label
          key={option?.value}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="radio"
            name={name}
            value={option?.value}
            checked={selected === option?.value}
            onChange={() => handleChange(option?.value)}
            className="peer hidden"
          />
          <div
            className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
              selected === option?.value ? "border-blue-500" : "border-gray-500"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                selected === option?.value ? "bg-blue-500" : "bg-transparent"
              }`}
            />
          </div>
          <span className="text-[#232323] text-xs font-medium leading-[16px]">
            {option?.label}
          </span>
        </label>
      ))}
    </div>
  );
}
