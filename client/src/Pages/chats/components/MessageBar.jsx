import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoSend } from "react-icons/io5"
import { GrAttachment } from "react-icons/gr"
import { RiEmojiStickerLine } from 'react-icons/ri'
import EmojiPicker from "emoji-picker-react"
import { useDispatch, useSelector } from 'react-redux'
import { useSocket } from '../../../context'
import { fileUpload } from '../../../Redux/slices/chatSlice'

function MessageBar() {
  const dispatch = useDispatch()
  const [message, setMessage] = useState("")
  const emojiRef = useRef()
  const fileInputRef = useRef()
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)
  const { emitMessage } = useSocket()
  const { userInfo } = useSelector((state) => state.auth)
  const { selectedChatType, selectedChatData } = useSelector((state) => state.chat)

  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMessage = async () => {
    if (message.trim() === '') return

    const messageData = {
      sender: userInfo._id,
      content: message,
      messageType: "text",
      fileUrl: undefined
    }

    if (selectedChatType === "contact") {
      emitMessage("sendMessage", { ...messageData, recipient: selectedChatData._id })
    } else if (selectedChatType === "channel") {
      emitMessage("send-channel-message", { ...messageData, channelId: selectedChatData._id })
    }

    setMessage("")
  }

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files?.[0]
      if (file) {
        const formData = new FormData()
        formData.append("file", file)
        const response = await dispatch(fileUpload(formData))
        if (response?.payload?.statusCode === 200 && response.payload?.data) {
          const messageData = {
            sender: userInfo._id,
            content: undefined,
            messageType: "file",
            fileUrl: response.payload?.data
          }

          if (selectedChatType === "contact") {
            emitMessage("sendMessage", { ...messageData, recipient: selectedChatData._id })
          } else if (selectedChatType === "channel") {
            emitMessage("send-channel-message", { ...messageData, channelId: selectedChatData._id })
          }
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='h-[10vh] bg-gradient-to-r from-[#1c1d25] to-[#2a2b33] flex justify-center items-center px-4 sm:px-8 mb-6 gap-4'
    >
      <div className='flex-1 flex bg-[#2a2b33] rounded-full items-center gap-3 pr-3 shadow-lg'>
        <input 
          type="text" 
          className='flex-1 p-3 sm:p-4 bg-transparent rounded-full focus:border-none focus:outline-none text-white placeholder-gray-400'
          placeholder='Type your message...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='text-neutral-400 focus:outline-none hover:text-white transition-all duration-300'
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-xl sm:text-2xl" />
        </motion.button>
        <input type='file' className='hidden' ref={fileInputRef} onChange={handleAttachmentChange} />
        <div className='relative'>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='text-neutral-400 focus:outline-none hover:text-white transition-all duration-300'
            onClick={() => setEmojiPickerOpen(prevValue => !prevValue)}
          >
            <RiEmojiStickerLine className="text-xl sm:text-2xl" />
          </motion.button>
          <AnimatePresence>
            {emojiPickerOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className='absolute bottom-12 right-0 z-10'
                ref={emojiRef}
              >
                <EmojiPicker theme="dark" onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className='bg-gradient-to-r from-[#8417ff] to-[#a517ff] rounded-full flex items-center justify-center p-3 sm:p-4 focus:outline-none text-white shadow-lg hover:shadow-xl transition-all duration-300'
        onClick={handleSendMessage}
      >
        <IoSend className="text-xl sm:text-2xl" />
      </motion.button>
    </motion.div>
  )
}

export default MessageBar
