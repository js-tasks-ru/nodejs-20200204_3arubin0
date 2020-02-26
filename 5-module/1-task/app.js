const path = require('path');
const Koa = require('koa');
const app = new Koa();
const {EventEmitter} = require('events');

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const ee = new EventEmitter();

router.get('/subscribe', async (ctx, next) => {
  const promise = new Promise((resolve, reject) => {
    ee.once('publish', (msg) => {
      ctx.response.body = msg;
      resolve();
    });
  });
  await promise; // будет ждать, пока промис не выполнится (*)
});

router.post('/publish', async (ctx, next) => {
  if (ctx.request.body.message) {
    ee.emit('publish', ctx.request.body.message);
  }
  ctx.status = 201;
});

app.use(router.routes());

module.exports = app;
