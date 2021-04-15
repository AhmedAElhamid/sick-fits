import { list } from '@keystone-next/keystone/schema';
import { integer, relationship, select, text } from '@keystone-next/fields';
import { isSignedIn, rules } from '../access';

export const OrderItem = list({
  // access:
  access: {
    create: isSignedIn,
    read: rules.canManageOrderItems,
    update: () => false,
    delete: () => false,
  },
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      ref: 'ProductImage',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] }, // which fields we can edit
        inlineEdit: { fields: ['image', 'altText'] }, // which fields we can edit
      },
    }),
    price: integer(),
    quantity: integer(),
    orders: relationship({ ref: 'Order.items' }),
    // TODO: add photo
  },
});
