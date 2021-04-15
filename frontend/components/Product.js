import React from 'react';
import Link from 'next/link';
import ItemStyles from './styles/ItemStyles';
import Title from './styles/Title';
import PriceTag from './styles/PriceTag';
import formatMoney from '../lib/formatMoney';
import DeleteProduct from './DeleteProduct';
import AddToCart from './AddToCart';
import HavePermission from './havePermission';

function Product({ product }) {
  console.log(product);
  return (
    <ItemStyles key={product.id}>
      <img
        src={product?.photo?.image?.publicUrlTransformed}
        alt={product.name}
      />
      <Title>
        <Link href={`/product/${product.id}`}>{product.name}</Link>
      </Title>

      <PriceTag>{formatMoney(product.price)}</PriceTag>
      <p>{product.description}</p>
      <div className="buttonList">
        <HavePermission permission="canManageProducts" product={product}>
          <Link
            href={{
              pathname: `/update`,
              query: { id: product.id },
            }}
          >
            Edit
          </Link>
        </HavePermission>
        <AddToCart id={product.id} />
        <HavePermission permission="canManageProducts" product={product}>
          <DeleteProduct id={product.id}>Delete</DeleteProduct>
        </HavePermission>
      </div>
    </ItemStyles>
  );
}

export default Product;
