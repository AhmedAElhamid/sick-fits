import React from 'react';

const TextArea = ({ name, inputs, label, handleChange, error, ...rest }) => (
  <div>
    <label htmlFor={name}>{label}</label>
    <textarea
      id={name}
      name={name}
      value={inputs[name]}
      placeholder={`Leave a ${name} here`}
      onChange={handleChange}
      style={{ height: 100 }}
      {...rest}
    />
    {error && <div>{error}</div>}
  </div>
);

export default TextArea;
