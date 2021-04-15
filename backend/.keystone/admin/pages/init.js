import { InitPage } from '@keystone-next/auth/pages/InitPage';
import React from 'react';
import { gql } from '@keystone-next/admin-ui/apollo';

const fieldPaths = ['name', 'password', 'email'];

export default function Init() {
  return (
    <InitPage
      listKey="User"
      fieldPaths={fieldPaths}
      showKeystoneSignup={true}
    />
  );
}
