const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  if (ctx.request.query.subcategory) {
    const [list] = await Product.find(
        {subcategory: ctx.request.query.subcategory});
    ctx.body = {products: (list ? [list] : [])};
  } else {
    const [list] = await Product.find();
    ctx.body = {products: [list]};
  }
};

module.exports.productList = async function productList(ctx, next) {
  const [list] = await Product.find();
  ctx.body = {products: [list]};
};

module.exports.productById = async function productById(ctx, next) {
  const {id} = ctx.params;
  await Product.findById(id, 'title subcategories').then((list) => {
    if (list) {
      ctx.body = {product: list};
    } else {
      ctx.status = 404;
    }
  }).catch((err) => {
    ctx.status = 400;
  });
};

