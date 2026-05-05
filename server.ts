import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";
import { verifyToken } from "./lib/auth";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000", 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Auth middleware for socket connections
  io.use((socket, next) => {
    const token =
      socket.handshake.auth.token || socket.handshake.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return next(new Error("Authentication required"));
    }

    const user = verifyToken(token);
    if (!user) {
      return next(new Error("Invalid token"));
    }

    socket.data.user = user;
    next();
  });

  io.on("connection", (socket) => {
    const user = socket.data.user;
    console.log(`[Socket] Connected: ${user.name} (${user.role})`);

    // Join personal notification room
    socket.join(`user:${user.userId}`);

    // Join a chat room
    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`[Socket] ${user.name} joined room: ${roomId}`);
    });

    // Leave a chat room
    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
    });

    // Send a message
    socket.on(
      "send_message",
      (data: { roomId: string; receiverId: string; content: string }) => {
        const message = {
          id: Date.now().toString(),
          roomId: data.roomId,
          content: data.content,
          senderId: user.userId,
          sender: { id: user.userId, name: user.name },
          createdAt: new Date().toISOString(),
          read: false,
        };

        // Broadcast to room
        io.to(data.roomId).emit("new_message", message);

        // Notify receiver
        io.to(`user:${data.receiverId}`).emit("notification", {
          type: "MESSAGE_RECEIVED",
          content: `New message from ${user.name}`,
        });
      }
    );

    // Typing indicators
    socket.on("typing_start", (roomId: string) => {
      socket.to(roomId).emit("user_typing", { userId: user.userId, name: user.name });
    });

    socket.on("typing_stop", (roomId: string) => {
      socket.to(roomId).emit("user_stopped_typing", { userId: user.userId });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${user.name}`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`\n🚀 Student Innovation Hub running at http://${hostname}:${port}\n`);
  });
});
