import { createServer } from 'http';
import { default as Koa, DefaultContext } from 'koa';
import socketIo from 'socket.io';

const app = new Koa();

const server = createServer(app.callback());

const io = socketIo(server);

app.use(async (ctx: DefaultContext) => {
  ctx.body = 'Who is John Galt?';
});

io.on('connection', () => {
  // tslint:disable-next-line:no-console
  console.log('Connected!');
});

export default server;
