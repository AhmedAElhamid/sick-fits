import { list } from '@keystone-next/keystone/schema';
import { relationship, text } from '@keystone-next/fields';
import { permissionFields, permissionsList } from './fields';
import { ListAccessArgs } from '../types';
import { permissions } from '../access';

export const Role = list({
  access: {
    create: permissions.canManageRoles,
    read: permissions.canManageRoles,
    update: permissions.canManageRoles,
    delete: permissions.canManageRoles,
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
  },
  fields: {
    name: text({ isRequired: true }),
    assignedTo: relationship({
      ref: 'User.role',
      many: true,
      ui: { itemView: { fieldMode: 'read' } },
    }),
    ...permissionFields,
  },
});
