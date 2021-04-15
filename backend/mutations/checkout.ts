/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { Session } from '../types';

import {CartItemCreateInput, OrderCreateInput} from '../.keystone/schema-types';
import stripConfig from "../lib/stripe";

const graphql = String.raw;
async function checkout(
    root: any,
    { token }: { token: string },
    context: KeystoneContext
): Promise<OrderCreateInput> {

    const userId = context.session.itemId;
    if(!userId){
        throw new Error("you need to be signed in to place an order!")
    }
    const user = await context.lists.User.findOne({
        where: {id: userId},
        resolveFields: graphql`
            id
            name
            email
            cart{
                id
                quantity
                product{
                    id
                    name
                    description
                    price
                    photo{
                        id
                        image{
                            id
                            publicUrlTransformed
                        }   
                    }   
                }
            }
        `
    })
    const cartItems = user.cart.filter(cartItem => cartItem.product);
    const amount = cartItems.reduce((total:number, cartItem:CartItemCreateInput)=>{
       return total + cartItem.quantity * cartItem.product.price
    },0)
    console.log(amount)

    const charge = await stripConfig.paymentIntents.create({
        amount,
        currency: "USD",
        confirm: true,
        payment_method: token,
    }).catch(e => {
        console.log(e.message)
        throw new Error(e.message)
    })
    console.log(charge)

    const orderItems = cartItems.map(cartItem => {
        return {
            name: cartItem.product.name,
            price: cartItem.product.price,
            description: cartItem.product.description,
            quantity: cartItem.quantity,
            photo: {connect : {id: cartItem.product.photo.id}},
        }
    })
    const order = await context.lists.Order.createOne({
        data:{
            total: charge.amount,
            charge: charge.id,
            items: {create: orderItems},
            user: {connect:{id:userId}}
        }
    })
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    await context.lists.CartItem.deleteMany({ids: cartItemIds})

    return order
}

export default checkout;
