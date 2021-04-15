export default function calculateTotalPrice(cart) {
  return cart.reduce((total, item) => {
    if (!item.product) return total;
    return total + item.quantity * item.product.price;
  }, 0);
}
