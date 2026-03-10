/**
 * Application Entry Point
 * This file imports the bootstrap function and initializes the application.
 */
import bootstrap from "./app.bootstrap.js";

const app = bootstrap();

// Start the server locally if not running in a Vercel serverless environment
if (!process.env.VERCEL) {
    const port = process.env.PORT || 4000;
    app.listen(port, () => console.log(`server is running on port ${port}`));
}

// Export the Express API for Vercel's serverless functions
export default app;
