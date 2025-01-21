import app, { httpServer } from "./app.js";
import dotenv from "dotenv";
import dbConnect from "./db/index.js";
import setupSocket from "./socket.js";

dotenv.config({
    path: "../.env"
});

const PORT = process.env.PORT || 3001;

dbConnect()
.then(
    () => {
        const server = httpServer.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
          });
        setupSocket(server);
    }
)
.catch(
    (error) => {
        console.error("Error connecting to the database:", error);
        process.exit(1);
    }
)