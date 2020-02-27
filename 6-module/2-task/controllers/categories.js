const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const [list] = await Category.find(null, 'title subcategories');
  ctx.body = {categories: [list]};
};
