import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkout from './checkout';

// make text highlighter
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
  // typeDefs: // typedef is the name of the method, the method arguments and return types
  // resolvers, // resolvers is links to node.js functions that will run when this methods requested
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
      checkout(token: String): Order
    }
  `,
  resolvers: {
    Mutation: {
      addToCart,
      checkout,
    },
  },
});
