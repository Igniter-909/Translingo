import { Server as SocketIOServer} from "socket.io";
import Message from "./models/messages.models.js";
import Channel from "./models/channel.models.js";


const setupSocket = (server) => {
    const io = new SocketIOServer(server,{
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET","POST"],
            credentials: true
        },
    });

    const userSocketMap = new Map();

    const disconnect = (socket) => {
        console.log(`Client Disconnected : ${socket.id}`);
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                break;
            }
        }
    }

    const sendChannelMessage = async(message) => {
        const {channelId, sender, content, messageType, fileUrl } = message;
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timestamp: new Date(),
            fileUrl,
        })
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender","id firstName lastName email avatar age")
            .exec();

        await Channel.findByIdAndUpdate(
            channelId,
            { $push : {messages: createdMessage._id}},
        );
        const channel = await Channel.findById(channelId).populate("members");
        const finalData = {
            ...messageData._doc,
            channelId: channel.id,
        }
        if(channel && channel.members){
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if(memberSocketId){
                    io.to(memberSocketId).emit("receive-channel-message", finalData)
                }
            })
        }
    }

    const sendMessage = async(message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient)

        const createdMessage = await Message.create(message);
        const messageData = await Message
            .findById(createdMessage._id)
            .populate("sender","id email firstName lastName avatar age")
            .populate("recipient","id email firstName lastName avatar age")

        if(recipientSocketId){
            io.to(recipientSocketId).emit("receiveMessage",messageData)
        }
        if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage",messageData)
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if(userId) {
            userSocketMap.set(userId, socket.id);
            console.log(`User connected : ${userId} with socket id: ${socket.id}`)
        }else{
            console.log("User Id not provided during socket connection")
        }
        socket.on("sendMessage",(message) => {
            console.log("Sending message event received ",message)
            sendMessage(message)
        })
        socket.on("send-channel-message",sendChannelMessage);
        socket.on("disconnect",() => disconnect(socket));
    })

}

export default setupSocket;