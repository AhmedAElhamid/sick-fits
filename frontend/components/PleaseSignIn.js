import React from 'react';
import SignIn from './SignIn';
import { useUser } from './User';

function PleaseSignIn({ children }) {
  const user = useUser();
  if (!user) return <SignIn />;
  return children;
}

export default PleaseSignIn;
