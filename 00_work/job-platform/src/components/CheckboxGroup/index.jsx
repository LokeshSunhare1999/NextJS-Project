import { useState } from "react";

export default function RadioCheckboxGroup({
  name,
  options,
  values = [],
  onChange,
}) {
  const [selected, setSelected] = useState(values);

  const handleChange = (val) => {
    let currentSelectedValues = [...selected];
    if (selected.includes(val)) {
      currentSelectedValues = currentSelectedValues.filter(
        (item) => item !== val
      );
      setSelected(selected.filter((item) => item !== val));
    } else {
      currentSelectedValues = [...currentSelectedValues, val];
      setSelected([...selected, val]);
    }
    if (onChange) onChange(currentSelectedValues);
  };

  return (
    <div className="flex items-center space-x-8">
      {options?.map((option) => (
        <label
          key={option?.value}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <input
            type="checkbox"
            name={name}
            value={option?.value}
            checked={selected.includes(option?.value)}
            onChange={() => handleChange(option?.value)}
          />

          <span className="text-[#232323] text-xs font-medium">
            {option?.label}
          </span>
        </label>
      ))}
    </div>
  );
}
