import React from 'react';
import capitalize from '../../lib/capitalize';

function DropDownInput({
  name,
  inputs,
  options = [],
  label,
  handleChange,
  error,
  ...rest
}) {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <select
        onChange={handleChange}
        value={capitalize(inputs[name])}
        id={name}
        name={name}
        {...rest}
      >
        <option disabled>Choose {label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <div>{error}</div>}
    </div>
  );
}

export default DropDownInput;
