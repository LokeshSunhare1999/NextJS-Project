import React from 'react'
import { CheckOutlined } from '@ant-design/icons';

const SelectBox = ({ title, icon, isSelected, onClick, userType }) => {
  return (
    <div
    className={`gap-2 p-4 border rounded-xl flex flex-col items-center justify-center cursor-pointer w-full max-w-[204px] relative text-center 
      ${isSelected ? 'border-[#20247E] border-2' : 'border-gray-200'} 
      ${userType ? 'h-[140px]' : 'h-[182px]'}`}
      onClick={onClick}
    >
      <div className={`${isSelected ? 'text-[#20247E]' : 'text-gray-500'}`}>{icon}</div>
      <p className={`mt-2 text-sm font-semibold ${isSelected ? 'text-[#20247E]' : 'text-gray-700'}`}>
        {title}
      </p>
      {isSelected ? (
        <div className="absolute top-2 right-2 bg-[#20247E] rounded-full p-1 w-6 h-6 flex items-center justify-center">
          <CheckOutlined style={{ fontSize: 14, color: 'white'}} />
        </div>
      ) : (
        <div className="absolute top-2 right-2 rounded-full p-1 border border-gray-300 flex items-center justify-center" style={{ width: 24, height: 24 }}>
          {/* Empty circle for unchecked state */}
        </div>
      )}
    </div>
  );
};
export default SelectBox
