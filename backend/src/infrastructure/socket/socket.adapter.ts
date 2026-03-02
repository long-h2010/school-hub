import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(
    private readonly app: INestApplication,
    private readonly jwtService: JwtService,
  ) {
    super(app);
  }

  create(port: number, options?: ServerOptions) {
    const server = super.create(port, {
      path: '/socket.io',
      cors: {
        origin: '*',
      },
      ...options,
    });

    return server;
  }

  createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, options);

    server.use((socket, next) => {
      try {
        const token = socket.handshake.auth?.token;
        if (!token) return next(new Error('Unauthorized'));

        const payload = this.jwtService.verify(token);
        socket.data.userId = (payload as any).id;
        next();
      } catch (err) {
        next(new Error('Unauthorized'));
      }
    });

    return server;
  }
}
