import { useContext, useState } from 'react';

const { createContext } = require('react');

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  const [cartOpen, setCartOpen] = useState(false);
  const toggleCartOpen = () => {
    setCartOpen(!cartOpen);
  };
  const closeCart = () => {
    setCartOpen(false);
  };
  const openCart = () => {
    setCartOpen(true);
  };
  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCartOpen, closeCart, openCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

function useCart() {
  const all = useContext(LocalStateContext); // useContext is the consumer for accessing the local state
  return all;
}

export { CartStateProvider, useCart };
