import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { createServer } from "http";

const app = express();

const httpServer = createServer(app);

app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"))
app.use(cookieParser());


import authRoutes from "./routes/auth.routes.js"
import contactRoutes from "./routes/contact.routes.js"
import chatRoutes from "./routes/chat.routes.js"
import channelRoutes from "./routes/channel.routes.js"
import errorHandler from "./utils/errorHandler.js";

app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/contact",contactRoutes);
app.use("/api/v1/chat",chatRoutes);
app.use("/api/v1/channel",channelRoutes)

app.use(errorHandler)

export default app;
export {httpServer};