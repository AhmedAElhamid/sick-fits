import gql from 'graphql-tag';
import { useMutation, useQuery } from '@apollo/client';
import Joi from 'joi-browser';
import Router from 'next/router';
import { ALL_PRODUCTS_QUERY } from '../pages/products';
import useForm from '../lib/useForm';
import Form from './styles/Form';
import DisplayError from './ErrorMessage';
import Input from './common/Input';
import DropDownInput from './common/DropDownInput';
import TextArea from './common/TextArea';

const SINGLE_PRODUCT_QUERY = gql`
  query SINGLE_PRODUCT_QUERY($id: ID!) {
    Product(where: { id: $id }) {
      id
      name
      price
      description
      status
      photo {
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const UPDATE_PRODUCT_MUTATION = gql`
  mutation UPDATE_PRODUCT_MUTATION(
    $id: ID!
    $name: String!
    $description: String!
    $price: Int!
    $status: String!
  ) {
    updateProduct(
      id: $id
      data: {
        name: $name
        description: $description
        price: $price
        status: $status
      }
    ) {
      id
      name
      price
      description
    }
  }
`;

function UpdatProduct({ id }) {
  const {
    data: queryData,
    loading: queryLoading,
    error: queryError,
  } = useQuery(SINGLE_PRODUCT_QUERY, {
    variables: { id },
  });
  const schema = {
    name: Joi.string().required().label('Name'),
    price: Joi.number().required().label('Price'),
    status: Joi.string().required().label('Status'),
    description: Joi.string().required().label('Description'),
  };
  const statusOptions = ['', 'Draft', 'Available', 'Unavailable'];

  const [
    updateProduct,
    { data: updateData, loading: updateLoading, error: updateError },
  ] = useMutation(UPDATE_PRODUCT_MUTATION);

  const doSubmit = async () => {
    const { name, description, price, status } = inputs;
    const res = await updateProduct({
      variables: {
        id,
        name,
        description,
        price,
        status: status.toUpperCase(),
      },
    });
    // eslint-disable-next-line no-use-before-define
    if (updateError) return;
    handleClear();
    await Router.push({ pathname: `/product/${res.data.updateProduct.id}` });
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
      name: queryData?.Product?.name,
      price: queryData?.Product?.price,
      description: queryData?.Product?.description,
      status: queryData?.Product?.status,
    },
    schema,
    doSubmit
  );

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <DisplayError error={queryError} />;
  return (
    <Form>
      <DisplayError error={updateError} />
      <fieldset disabled={updateLoading} aria-busy={updateLoading}>
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
          + Update Product
        </button>
      </fieldset>
    </Form>
  );
}

export default UpdatProduct;
