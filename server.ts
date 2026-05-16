import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { parse } from 'url';
import next from 'next';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    transports: ['websocket', 'polling'],
  });

  // Room management
  const rooms = new Map<string, Set<string>>();

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join-room', ({ roomId }: { roomId: string }) => {
      console.log(`User ${socket.id} joining room ${roomId}`);

      // Initialize room if doesn't exist
      if (!rooms.has(roomId)) {
        rooms.set(roomId, new Set());
      }

      const roomUsers = rooms.get(roomId)!;
      const previousUsers = Array.from(roomUsers);
      roomUsers.add(socket.id);

      socket.join(roomId);

      // Notify the new user about existing peers
      socket.emit('peers', {
        peers: previousUsers,
      });

      // Notify other users about the new peer
      socket.to(roomId).emit('user-joined', {
        userId: socket.id,
      });

      // Store room info on socket
      (socket as any).roomId = roomId;
    });

    socket.on('offer', ({ to, offer }: { to: string; offer: any }) => {
      console.log(`Offer from ${socket.id} to ${to}`);
      io.to(to).emit('offer', {
        from: socket.id,
        offer,
      });
    });

    socket.on('answer', ({ to, answer }: { to: string; answer: any }) => {
      console.log(`Answer from ${socket.id} to ${to}`);
      io.to(to).emit('answer', {
        from: socket.id,
        answer,
      });
    });

    socket.on('ice-candidate', ({ to, candidate }: { to: string; candidate: any }) => {
      io.to(to).emit('ice-candidate', {
        from: socket.id,
        candidate,
      });
    });

    socket.on('chat-message', ({ roomId, message, sender }: { roomId: string; message: string; sender: string }) => {
      io.to(roomId).emit('chat-message', {
        sender,
        message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
      const roomId = (socket as any).roomId;

      if (roomId) {
        const roomUsers = rooms.get(roomId);
        if (roomUsers) {
          roomUsers.delete(socket.id);

          // Notify other users about the disconnection
          io.to(roomId).emit('user-left', {
            userId: socket.id,
          });

          // Clean up empty rooms
          if (roomUsers.size === 0) {
            rooms.delete(roomId);
          }
        }
      }
    });
  });

  httpServer.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
});
