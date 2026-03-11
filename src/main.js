import dotenv from "dotenv";
dotenv.config();

/**
 * Application Entry Point
 * This file imports the bootstrap function and initializes the application.
 */
import bootstrap from "./app.bootstrap.js";


import http from "http";
import { initSocket } from "./socket/socket.handler.js";

const app = bootstrap();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Start the server locally if not running in a Vercel serverless environment
if (!process.env.VERCEL) {
    const port = process.env.PORT || 4000;
    server.listen(port, () => console.log(`🚀 server is running on port ${port} (Socket.io enabled)`));
}

// Export the server instance for potential serverless needs, 
// though sockets won't work in standard serverless functions.
export default server;
