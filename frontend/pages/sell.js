import React from 'react';
import CreateProduct from '../components/CreateProduct';
import PleaseSignIn from '../components/PleaseSignIn';

function Sell(props) {
  return (
    <>
      <PleaseSignIn>
        <CreateProduct />
      </PleaseSignIn>
    </>
  );
}

export default Sell;
