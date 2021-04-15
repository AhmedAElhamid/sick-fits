import React from 'react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import DisplayError from './ErrorMessage';
import { CURRENT_USER_QUERY, useUser } from './User';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID) {
    addToCart(productId: $id) {
      id
    }
  }
`;

function AddToCart({ id }) {
  const router = useRouter();
  const user = useUser();
  const [addToCart, { error, loading }] = useMutation(ADD_TO_CART_MUTATION, {
    variables: { id },
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return (
    <>
      {error && <DisplayError error={error} />}
      <button
        type="button"
        disabled={loading}
        onClick={() => {
          if (!user)
            return router.push({
              pathname: '/signin',
            });
          addToCart();
        }}
      >
        Add{loading && 'ing'}
      </button>
    </>
  );
}

export default AddToCart;
