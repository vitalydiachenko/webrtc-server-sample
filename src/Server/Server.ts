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
        // tslint:disable-next-line:no-console
        console.log('\x1b[34m', `Received '${SocketEvent.CallUser}' from '${socket.id}'`);

        socket.to(to).emit(SocketEvent.CallMade, {
          offer,
          socket: socket.id,
        });

        // tslint:disable-next-line:no-console
        console.log('\x1b[32m', `Sent '${SocketEvent.CallMade}' to '${to}'`);
      });

      socket.on(SocketEvent.MakeAnswer, ({ to, answer }) => {
        // tslint:disable-next-line:no-console
        console.log('\x1b[34m', `Received '${SocketEvent.MakeAnswer}' from '${socket.id}'`);

        socket.to(to).emit(SocketEvent.AnswerMade, {
          answer,
          socket: socket.id,
        });

        // tslint:disable-next-line:no-console
        console.log('\x1b[32m', `Sent '${SocketEvent.AnswerMade}' to '${to}'`);
      });

      socket.on(SocketEvent.SendIceCandidate, ({ to, candidate }) => {
        // tslint:disable-next-line:no-console
        console.log('\x1b[34m', `Received '${SocketEvent.SendIceCandidate}' from '${socket.id}'`);

        socket.to(to).emit(SocketEvent.IceReceived, {
          candidate,
          socket: socket.id,
        });

        // tslint:disable-next-line:no-console
        console.log('\x1b[32m', `Sent '${SocketEvent.IceReceived}' to '${to}'`);
      });

      socket.on(SocketEvent.EndCall, ({ to }) => {
        // tslint:disable-next-line:no-console
        console.log('\x1b[34m', `Received '${SocketEvent.EndCall}' from '${socket.id}'`);

        socket.to(to).emit(SocketEvent.CallEnded);

        // tslint:disable-next-line:no-console
        console.log('\x1b[32m', `Sent '${SocketEvent.CallEnded}' to '${to}'`);
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
