import React from 'react';

const Input = ({ type = 'text', value, onChange, className = '' }) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      className={`w-full p-2 border rounded ${className}`}
    />
  );
};

export default Input;