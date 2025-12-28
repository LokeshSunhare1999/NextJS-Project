import React, { useState, useRef, useEffect } from "react";

export default function OtpField({
  length = 4,
  value,
  setValue,
  onSubmit = () => {},
  onEnterPress = () => {},
  inputBorderColor = "#e0dafb",
  inputBgColor = "#3b2b8c",
  inputBorderRadius = "8px",
  inputTextColor = "#000",
  customOnChange = () => {},
}) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  const inputRefs = useRef([]);
  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);
  const handleOnChange = (e, index) => {
    const value = e.target.value;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    customOnChange(newOtp.join(""));
    // number check
    const combinedOtp = newOtp.join("");
    setValue(combinedOtp);
    // Moving to next input
    if (value && index + 1 < length && inputRefs.current[index + 1])
      inputRefs.current[index + 1].focus();
    if (combinedOtp.length === length) onSubmit();
  };
  const handleOnKeyDown = (e, index) => {
    if (e.key === "Enter") {
      onEnterPress();
    }
    // handle backspace
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };
  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);
  };
  return (
    <div className="flex w-full gap-0.5">
      {otp.map((value, index) => (
        <input
          key={index}
          placeholder="-"
          className="w-1/4 h-[60px] m-2 p-1.5 focus:outline-none text-2xl text-center border-2 border-black"
          style={{
            backgroundColor: inputBgColor,
            borderRadius: inputBorderRadius,
            borderColor: inputBorderColor,
            color: inputTextColor,
          }}
          value={value}
          ref={(input) => (inputRefs.current[index] = input)}
          onChange={(e) => handleOnChange(e, index)}
          onKeyDown={(e) => handleOnKeyDown(e, index)}
          onClick={(e) => handleClick(index)}
          type="number"
        />
      ))}
    </div>
  );
}
