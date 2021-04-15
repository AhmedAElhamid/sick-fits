import React from 'react';
import { useUser } from './User';

function HavePermission({ children, permission, product }) {
  const user = useUser();
  console.log(user);
  if (!user) return null;
  if (user?.role?.[permission] || product.user?.id === user?.id) {
    return children;
  }
}

export default HavePermission;
