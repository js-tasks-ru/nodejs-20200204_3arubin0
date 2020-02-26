const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
  if (ctx.request.query.query) {
    const list = await Product.find(
        {$text: {$search: ctx.request.query.query}},
        {score: {$meta: 'textScore'}}
    ).sort( {score: {$meta: 'textScore'}}
    );
    ctx.body = {products: list};
  } else {
    ctx.body = {products: []};
  }
};
