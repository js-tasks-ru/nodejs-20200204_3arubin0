const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

function mapOrder(order) {
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
}

module.exports.checkout = async function checkout(ctx, next) {
  if (!ctx.user) {
    ctx.status = 401;
    return;
  }
  const order = new Order({
    user: ctx.user.id,
    product: ctx.request.body.product,
    phone: ctx.request.body.phone,
    address: ctx.request.body.address,
  });

  let newOrder;
  await order.save().then(
      (result) =>{
        newOrder = result;
      },
      (err) => {
        const errResult = {};
        if (err.errors.product) {
          errResult.product = ['required'];
        }
        if (err.errors.phone) {
          errResult.phone = err.errors.phone.message;
        }
        if (err.errors.address) {
          errResult.address = ['required'];
        }
        ctx.status = 400;
        ctx.body = {errors: errResult};
        return;
      }
  );
  if (newOrder) {
    await sendMail({
      template: 'order-confirmation',
      locals: {id: newOrder.id, product: newOrder.product},
      to: ctx.user.email,
      subject: 'Order Registration',
    });
    ctx.body = {order: newOrder.id};
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user.id});
  const orderMaps = orders.map((order) => mapOrder(order));
  ctx.body = {orders: orderMaps};
};
