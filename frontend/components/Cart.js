import React from 'react';
import CartStyles from './styles/CartStyles';
import { useUser } from './User';
import Supreme from './styles/Supreme';
import CartItem from './CartItem';
import formatMoney from '../lib/formatMoney';
import calculateTotalPrice from '../lib/claculateTotalPrice';
import { useCart } from '../lib/cartState';
import CloseButton from './styles/CloseButton';
import Checkout from './Checkout';

function Cart() {
  const user = useUser();
  const { cartOpen, closeCart } = useCart();
  return (
    <CartStyles open={cartOpen}>
      {!user && (
        <>
          <p>Please Sign in to see your cart</p>
          <header>
            <CloseButton onClick={closeCart}> &times;</CloseButton>
          </header>
        </>
      )}
      {user && (
        <>
          <header>
            <Supreme>{user.name}'s Cart</Supreme>
            <CloseButton onClick={closeCart}> &times;</CloseButton>
          </header>

          <ul>
            {user.cart.map((cartItem) => (
              <CartItem key={cartItem.id} cartItem={cartItem} />
            ))}
          </ul>
          <footer>
            <p>{formatMoney(calculateTotalPrice(user.cart))}</p>
            <Checkout />
          </footer>
        </>
      )}
    </CartStyles>
  );
}

export default Cart;
