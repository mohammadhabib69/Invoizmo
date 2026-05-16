import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

class SocketService {
  private io: Server | null = null;
  // Map of userId to Set of socket ids
  private userSockets: Map<string, Set<string>> = new Map();

  public init(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: env.FRONTEND_URL,
        credentials: true,
      },
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as DecodedToken;
        socket.data.user = decoded;
        next();
      } catch (err) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.user?.id;
      if (userId) {
        if (!this.userSockets.has(userId)) {
          this.userSockets.set(userId, new Set());
        }
        this.userSockets.get(userId)!.add(socket.id);
        
        // Also join a room for the user to make broadcasting easier
        socket.join(userId);
      }

      socket.on('disconnect', () => {
        if (userId && this.userSockets.has(userId)) {
          const userSet = this.userSockets.get(userId)!;
          userSet.delete(socket.id);
          if (userSet.size === 0) {
            this.userSockets.delete(userId);
          }
        }
      });
    });
  }

  public emitToUser(userId: string, event: string, data: any) {
    if (this.io) {
      this.io.to(userId).emit(event, data);
    }
  }

  public emitToAll(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }
}

export const socketService = new SocketService();
