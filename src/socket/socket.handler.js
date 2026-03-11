import { Server } from "socket.io";

let io;
const userSockets = new Map(); // userId -> socketId

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("🔌 New connection:", socket.id);

        socket.on("join", (userId) => {
            if (userId) {
                userSockets.set(userId.toString(), socket.id);
                console.log(`👤 User ${userId} joined with socket ${socket.id}`);
            }
        });

        socket.on("disconnect", () => {
            // Cleanup userSockets
            for (const [userId, socketId] of userSockets.entries()) {
                if (socketId === socket.id) {
                    userSockets.delete(userId);
                    console.log(`👋 User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
};

export const emitToUser = (userId, event, data) => {
    if (!io) return;
    const socketId = userSockets.get(userId.toString());
    if (socketId) {
        io.to(socketId).emit(event, data);
        return true;
    }
    return false;
};

export const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};
