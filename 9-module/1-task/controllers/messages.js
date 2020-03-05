const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user.id});

  ctx.body = {messages: messages.map((msg)=>({
    date: msg.date,
    text: msg.text,
    id: msg.id,
    user: msg.user}))};
};
