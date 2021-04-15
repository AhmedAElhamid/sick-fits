import React from 'react';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import Product from '../../components/Product';
import Pagination from '../../components/Pagination';
import { perPage } from '../../config';

export const ALL_PRODUCTS_QUERY = gql`
  query ALL_PRODUCTS_QUERY($skip: Int = 0, $first: Int) {
    allProducts(first: $first, skip: $skip) {
      id
      name
      price
      description
      user {
        id
      }
      photo {
        id
        image {
          publicUrlTransformed
        }
      }
    }
  }
`;

const ProductListStyles = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
`;

function OrderPage() {
  const { query } = useRouter();
  const page = parseInt(query?.page) || 1;
  const { data, error, loading } = useQuery(ALL_PRODUCTS_QUERY, {
    variables: {
      skip: page * perPage - perPage,
      first: perPage,
    },
  }); // the loading happens on the server-side
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
      <Pagination page={page} />
      <ProductListStyles>
        {data?.allProducts?.map((p) => (
          <Product product={p} key={p.id} />
        ))}
      </ProductListStyles>
      <Pagination page={page} />
    </div>
  );
}

export default OrderPage;
