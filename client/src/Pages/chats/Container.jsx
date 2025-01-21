import React from "react"
import { motion } from "framer-motion"
import Contacts from "./Contacts"
import EmptyContainer from "./EmptyContainer"
import ChatContainer from "./ChatContainer"
import { useSelector } from "react-redux"

function Container() {
  const { selectedChatType } = useSelector((state) => state.chat)

  return (
    <motion.div
      className="w-screen h-screen flex overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Contacts />
      {selectedChatType === undefined ? (
        <motion.div
          key="empty"
          className="w-full"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <EmptyContainer />
        </motion.div>
      ) : (
        <motion.div
          key="chat"
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -300, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <ChatContainer />
        </motion.div>
      )}
    </motion.div>
  )
}

export default Container

