import React, { Component } from 'react';
import Joi from 'joi-browser';
import styled from 'styled-components';
import Form from './common/form';

const FormStyles = styled.div`
  font-size: 175%;
  button {
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    border-radius: 4px;
    display: inline-block;
    font-size: 16px;
  }
`;

class ProductForm extends Form {
  state = {
    data: {
      name: '',
      price: 0,
      status: '',
      description: '',
    },
    errors: {},
  };

  schema = {
    name: Joi.string().required().max(100).label('Product Name'),
    status: Joi.string().required().label('Status'),
    description: Joi.string().required().max(500).label('Description'),
    price: Joi.number().min(0).required().label('Price'),
  };

  joiSchema = Joi.object(this.schema);

  render() {
    const options = ['Draft', 'Available', 'Unavailable'];
    return (
      <FormStyles>
        {this.renderInput('name', 'Product Name')}
        {this.renderInput('price', 'Price', 'number')}
        {this.renderDropdownInput('status', 'Status', options)}
        {this.renderTextArea('description', 'Description')}
        {this.renderButton('Submit')}
      </FormStyles>
    );
  }
}

export default ProductForm;

// function ProductForm(props) {
//   const { inputs, handleChange } = useForm({});
//   return (
//     <form>
//       <label htmlFor="name">Name</label>
//       <input
//         id="name"
//         name="name"
//         value={inputs.name}
//         onChange={handleChange}
//       />
//     </form>
//   );
// }
