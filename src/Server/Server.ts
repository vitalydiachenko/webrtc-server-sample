import { SocketEvent } from 'consts';
import { createServer, Server as HttpServer } from 'http';
import { default as Koa, DefaultContext } from 'koa';
import socketIo, { Server as SocketIOServer, Socket } from 'socket.io';

class Server {
  private activeSockets: string[] = [];
  private app: Koa;
  private httpServer: HttpServer;
  private io: SocketIOServer;

  constructor() {
    this.initialise();

    this.handleRoutes();

    this.handleSocketConnection();
  }

  public listen(port: number, host: string) {
    this.httpServer.listen(port, host, () => {
      // tslint:disable-next-line:no-console
      console.log(`Server is listened on ${host}:${port}`);
    });
  }

  private handleRoutes() {
    this.app.use(async (ctx: DefaultContext) => {
      ctx.body = 'Who is John Galt?';
    });
  }

  private handleSocketConnection() {
    this.io.on('connection', (socket: Socket) => {
      if (!this.activeSockets.find((socketId: string) => socketId === socket.id)) {
        this.activeSockets.push(socket.id);

        socket.emit(SocketEvent.UpdateUsersList, {
          users: this.activeSockets.filter(socketId => socketId !== socket.id),
        });

        socket.broadcast.emit(SocketEvent.AddUserToList, {
          user: socket.id,
        });
      }

      socket.on('disconnect', () => {
        this.activeSockets = this.activeSockets.filter(socketId => socketId !== socket.id);

        socket.broadcast.emit(SocketEvent.RemoveUserFromList, {
          user: socket.id,
        });
      });

      socket.on(SocketEvent.CallUser, ({ to, offer }) => {
        socket.to(to).emit(SocketEvent.CallMade, {
          offer,
          socket: socket.id,
        });
      });
    });
  }

  private initialise(): void {
    this.app = new Koa();

    this.httpServer = createServer(this.app.callback());

    this.io = socketIo(this.httpServer);
  }
}

export default Server;
