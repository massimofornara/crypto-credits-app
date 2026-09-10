import React from 'react';

const Select = ({ value, onChange, children, className = '' }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded ${className}`}
    >
      {children}
    </select>
  );
};

export default Select;