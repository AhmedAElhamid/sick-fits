import { list } from '@keystone-next/keystone/schema';
import {
  integer,
  relationship,
  select,
  text,
  virtual,
} from '@keystone-next/fields';
import { isSignedIn, rules } from '../access';

export const Order = list({
  access: {
    create: isSignedIn,
    read: rules.canManageOrder,
    update: () => false,
    delete: () => false,
  },
  fields: {
    label: virtual({
      // create custom label that generated on the fly
      graphQLReturnType: 'String',
      resolver(item) {
        return `${item.total}`;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.orders', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
});
