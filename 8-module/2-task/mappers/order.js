module.exports = function mapOrder(order) {
  return {
    id: order.id,
    user: order.user,
    product: {
      id: order.product.id,
      title: order.product.title,
      images: order.product.images,
      category: order.product.category,
      subcategory: order.product.subcategory,
      price: order.product.price,
      description: order.description,
    },
  };
};
