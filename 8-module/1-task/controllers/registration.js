const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  await User.findOne({email: ctx.request.body.email}).then((user) => {
    if (!user) {
      ctx.status = 400;
      ctx.body = {errors: {email: 'Такой email уже существует'}};
      return;
    }
  }).catch((e)=>{
    console.log(e);
  });

  const token = uuid();
  const user = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: token,
  });
  await user.setPassword(ctx.request.body.password);
  let isUserSave = false;
  await user.save().then(
      (result) => {
        // отправить почту
        isUserSave = true;
      },
      (err) => {
        if (err.errors.email) {
          ctx.status = 400;
          ctx.body = {errors: {email: err.errors.email.message}};
        }
      });

  if (isUserSave) {
    await sendMail({
      template: 'confirmation',
      locals: {token: user.verificationToken},
      to: user.email,
      subject: 'Registration'}).then(
        (result) =>{
          ctx.body = {status: 'ok'};
        },
        (err) => {
          console.log(err);
        }
    );
  }
};

module.exports.confirm = async (ctx, next) => {
  const token = ctx.request.body.verificationToken;
  const user = await User.findOne({verificationToken: token});

  if (user) {
    user.verificationToken = undefined;
    await user.save();
    const token = await ctx.login(user);
    ctx.body = {token};
  } else {
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
};
