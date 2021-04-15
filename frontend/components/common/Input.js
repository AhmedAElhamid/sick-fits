import React from 'react';

function Input({ name, inputs, label, handleChange, error, ...rest }) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input onChange={handleChange} id={name} name={name} {...rest} />
      {error && <div>{error}</div>}
    </div>
  );
}

export default Input;
