import React from 'react'

const BadgeComponent = ({
  title,
  icon,
  height = '48px',
  width = 'auto',
  backgroundColor = 'bg-green-200' }) => {
  return (
    <div className="relative inline-flex items-center mt-1">
      <div className="absolute left-[44px] -translate-x-1/2 z-10">
        {icon}
      </div>
      <div
        className={`flex items-center pl-20 rounded-full ${backgroundColor}`}
        style={{ height, width }}
      >
        <p className="text-xs font-medium text-[#111] leading-[18px] tracking-[-0.24px] not-first:whitespace-nowrap">{title}</p>
      </div>
    </div>
  )
}

export default BadgeComponent
