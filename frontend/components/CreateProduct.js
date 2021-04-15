import React from 'react';

import Joi from 'joi-browser';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import Router from 'next/router';
import useForm from '../lib/useForm';
import Input from './common/Input';
import TextArea from './common/TextArea';
import DropDownInput from './common/DropDownInput';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from '../pages/products';

const CREATE_PRODUCT_MUTATION = gql`
  mutation CREATE_PRODUCT_MUTATION(
    $name: String! # ! means is required
    $description: String!
    $status: String!
    $price: Int!
    $image: Upload
  ) {
    createProduct(
      data: {
        name: $name
        price: $price
        description: $description
        status: $status
        photo: { create: { image: $image, altText: $name } } # create productImage(nested creation)
      }
    ) {
      id
      name
      price
      description
    }
  }
`;

function CreateProduct() {
  const schema = {
    name: Joi.string().required().label('Name'),
    price: Joi.number().required().label('Price'),
    status: Joi.string().required().label('Status'),
    description: Joi.string().required().label('Description'),
    image: Joi.any().required(),
  };
  const statusOptions = ['', 'Draft', 'Available', 'Unavailable'];
  const [createProduct, { data, error, loading }] = useMutation(
    CREATE_PRODUCT_MUTATION,
    {
      refetchQueries: [{ query: ALL_PRODUCTS_QUERY }], // fetch the data again to updated the cached data
    }
  );
  const doSubmit = async (data) => {
    console.log(data);
    data.status = data?.status.toUpperCase();

    const res = await createProduct({ variables: data });
    if (error) return;
    // eslint-disable-next-line no-use-before-define
    handleClear();
    await Router.push({ pathname: `/product/${res.data.createProduct.id}` });
  };
  const {
    inputs,
    errors,
    handleChange,
    handleSubmit,
    validate,
    handleClear,
  } = useForm(
    {
      name: '',
      price: '',
      description: '',
      status: '',
      image: '',
    },
    schema,
    doSubmit
  );
  return (
    <Form>
      <DisplayError error={error} />
      <fieldset disabled={loading} aria-busy={loading}>
        <Input
          label="Name"
          name="name"
          error={errors?.name}
          value={inputs.name}
          inputs={inputs}
          handleChange={handleChange}
        />
        <Input
          label="Price"
          name="price"
          type="number"
          error={errors?.price}
          value={inputs.price}
          inputs={inputs}
          handleChange={handleChange}
        />
        <Input
          label="Image"
          name="image"
          type="file"
          handleChange={handleChange}
        />
        <DropDownInput
          label="Status"
          name="status"
          options={statusOptions}
          error={errors?.status}
          inputs={inputs}
          handleChange={handleChange}
        />
        <TextArea
          label="Description"
          name="description"
          error={errors?.description}
          inputs={inputs}
          handleChange={handleChange}
        />
        <button disabled={validate()} type="submit" onClick={handleSubmit}>
          + Add Product
        </button>
      </fieldset>
    </Form>
  );
}

export default CreateProduct;
