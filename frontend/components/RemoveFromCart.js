import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const REMOVE_ITEM_FROM_CART_MUTATION = gql`
  mutation REMOVE_ITEM_FROM_CART_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

function RemoveFromCart({ id }) {
  const [removeItem, { loading }] = useMutation(
    REMOVE_ITEM_FROM_CART_MUTATION,
    {
      variables: { id },
      update,
    }
  );
  return (
    <BigButton
      type="button"
      disabled={loading}
      title="Remove Item"
      onClick={removeItem}
    >
      {' '}
      &times;
    </BigButton>
  );
}

export default RemoveFromCart;
