import { config, createSchema } from '@keystone-next/keystone/schema';

import 'dotenv/config';
import { createAuth } from '@keystone-next/auth';
import {
  statelessSessions,
  withItemData,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { CartItem } from './schemas/CartItem';
import { extendGraphqlSchema } from './mutations';
import { OrderItem } from './schemas/OrderItem';
import { Order } from './schemas/Order';
import { Role } from './schemas/Role';
import { permissionsList } from './schemas/fields';

const dataBaseUrl =
  process.env.DATABASE_URL || 'mongodb://localhost/keystone-sick-fits-tutorial';

const sessionConfig = {
  maxAge: 60 * 60 * 24 * 360, // how long they stay signed in (360 days)
  secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
  listKey: 'User', // which schema is responsible for login(have the credentials to login)
  identityField: 'email', // which field will identify the user
  secretField: 'password',
  initFirstItem: {
    fields: ['name', 'password', 'email'],
    // TODO: add initial roles here
  },
  passwordResetLink: {
    async sendToken(args) {
      await sendPasswordResetEmail(args.token, args.identity);
    },
  },
});

export default withAuth(
  config({
    server: {
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      adapter: 'mongoose',
      url: dataBaseUrl,
      // TODO add data seeding here
      async onConnect(keystone) {
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    lists: createSchema({
      User,
      Product,
      ProductImage,
      CartItem,
      OrderItem,
      Order,
      Role,
      // schema items go here
    }),
    extendGraphqlSchema,
    ui: {
      // want people access the backend or get all the data from the frontend only
      // TODO change this for roles
      // show the ui for anyone
      isAccessAllowed: ({ session }) => !!session?.data, // graphQL query
    },

    session: withItemData(statelessSessions(sessionConfig), {
      User: `id name email role{ ${permissionsList.join(' ')} }`, // will pass the id and any other data we query along every single session
    }),
  })
);
