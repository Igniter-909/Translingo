import React from "react"
import { motion } from "framer-motion"
import ChatHeader from "./components/ChatHeader"
import Chats from "./components/Chats"
import MessageBar from "./components/MessageBar"

function ChatContainer() {
  return (
    <motion.div
      className="fixed top-0 h-screen bg-[#1c1d25] flex flex-col md:static md:flex-1 text-white"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ChatHeader />
      <Chats />
      <MessageBar />
    </motion.div>
  )
}

export default ChatContainer

