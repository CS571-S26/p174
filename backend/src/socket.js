import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import prisma from "./prismaClient.js";

export function initSocket(httpServer) {
  const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5174")
    .split(",")
    .map((s) => s.trim());
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.query.token || socket.handshake.auth?.token;
    if (!token) return next(new Error("Authentication required"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload.id;
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`[Socket] Connected: ${socket.userId}`);

    // Auto-join all conversation rooms the user belongs to
    try {
      const participations = await prisma.conversationParticipant.findMany({
        where: { userId: socket.userId },
        select: { conversationId: true },
      });
      for (const p of participations) {
        socket.join(p.conversationId);
      }
    } catch (err) {
      console.error("[Socket] Failed to join rooms:", err.message);
    }

    // Manually join a conversation room (e.g. after creating a new one)
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
    });

    socket.on("typing", ({ conversationId }) => {
      socket.to(conversationId).emit("typing", {
        conversationId,
        userId: socket.userId,
      });
    });

    socket.on("stop-typing", ({ conversationId }) => {
      socket.to(conversationId).emit("stop-typing", {
        conversationId,
        userId: socket.userId,
      });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.userId}`);
    });
  });

  return io;
}
