import React from 'react';

interface FilterIconProps {
  className?: string;
}

const FilterIcon: React.FC<FilterIconProps> = ({ className = "w-5 h-5" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 4.5C3 4.22386 3.22386 4 3.5 4H20.5C20.7761 4 21 4.22386 21 4.5V6.5C21 6.63261 20.9473 6.75979 20.8536 6.85355L14.5 13.2071V19.5C14.5 19.6519 14.4268 19.7946 14.3036 19.8821L11.3036 21.8821C11.1116 22.0146 10.8519 22.0249 10.6494 21.9085C10.4469 21.7921 10.3333 21.5698 10.3333 21.3333V13.2071L3.14645 6.85355C3.05268 6.75979 3 6.63261 3 6.5V4.5Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default FilterIcon;
