import { useEffect, useState } from 'react';
import Joi from 'joi-browser';

export default function useForm(initial = {}, schema, doSubmit) {
  const [inputs, setInputs] = useState(initial);
  const [errors, setErrors] = useState({});

  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
  }, [initialValues]);

  const joiSchema = Joi.object(schema);

  const validate = () => {
    if (!schema) return;
    const validationErrors = {};
    const { error } = joiSchema.validate(inputs);

    if (!error) return null;
    error.details.map((e) => {
      if (!errors[e.path[0]]) validationErrors[e.path[0]] = e.message;
    });

    return validationErrors;
  };

  const validateProperty = ({ name, value }) => {
    if (!schema) return;
    const obj = { [name]: value };

    const propertySchema = { [name]: schema[name] };
    const { error } = Joi.object(propertySchema).validate(obj);

    return error ? error.details[0].message : null;
  };

  function handleChange({ target }) {
    let { name, value, type } = target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = target.files;
    }
    setInputs({
      ...inputs,
      [name]: value,
    });
    const error = validateProperty({ name, value });
    setErrors({ ...errors, [name]: error });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors({ errors: validationErrors || {} });

    doSubmit(inputs);
  };
  const handleReset = () => {
    setInputs(initial);
    console.log(inputs);
    setErrors({});
  };
  const handleClear = () => {
    setInputs(Object.fromEntries(Object.entries(inputs).map(([e]) => [e, ''])));
    setErrors({});
  };

  return {
    inputs,
    errors,
    validate,
    handleSubmit,
    handleReset,
    handleClear,
    handleChange,
  };
}
