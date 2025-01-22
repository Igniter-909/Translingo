import React, { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import moment from "moment"
import { getAllMessages, getChannelMessagesData } from "../../../Redux/slices/chatSlice"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"
import axios from "axios"
import { saveAs } from "file-saver"
import { IoCloseSharp } from "react-icons/io5"

const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY

function Chats() {
  const scrollRef = useRef(null)
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const { selectedChatType, selectedChatData, selectedChatMessages } = useSelector((state) => state.chat)
  const [showImage, setShowImage] = useState(false)
  const [imageUrl, setImageUrl] = useState(null)

  useEffect(() => {
    const getMessages = async () => {
      await dispatch(getAllMessages({ id: selectedChatData._id }))
    }
    const getChannelMessages = async () => {
      await dispatch(getChannelMessagesData({ channelId: selectedChatData._id }))
    }
    if (selectedChatType === "contact") {
      getMessages()
    } else if (selectedChatType === "channel") {
      getChannelMessages()
    }
  }, [selectedChatData, selectedChatType, dispatch])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedChatMessages])

  const checkIfImage = (filePath) => {
    const imageRegex = /\.(jpg|png|gif|bmp|tiff|webp|svg|ico|heic|heif)$/i
    return imageRegex.test(filePath)
  }

  const handleDownload = async (filePath) => {
    try {
      const response = await axios.get(filePath, {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${CLOUDINARY_API_KEY}`,
        },
      })
      const fileName = filePath.split("/").pop()
      console.log("Response",response)
      saveAs(response.data, fileName)
    } catch (error) {
      console.error("Error downloading the file: ", error)
    }
  }

  const renderMessages = () => {
    let lastDate = null
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD")
      const showDate = messageDate !== lastDate
      if (showDate) {
        lastDate = messageDate
      }
      return (
        <React.Fragment key={index}>
          {showDate && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-gray-500 my-4"
            >
              {moment(message.timestamp).format("LL")}
            </motion.div>
          )}
          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </React.Fragment>
      )
    })
  }

  const renderDMMessages = (message) => {
    const isOwnMessage = message.sender !== selectedChatData._id
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"} mb-4`}
      >
        <div
          className={`max-w-[70%] p-3 rounded-lg ${
            isOwnMessage ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-[#2a2b33] text-gray-200"
          }`}
        >
          {message.messageType === "text" && <p>{message.content}</p>}
          {message.messageType === "file" && renderFileContent(message.fileUrl)}
        </div>
        <span className="text-gray-500 text-xs mt-1">{moment(message.timestamp).format("LT")}</span>
      </motion.div>
    )
  }

  const renderChannelMessages = (message) => {
    const isOwnMessage = message.sender._id === userInfo._id
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
      >
        {!isOwnMessage && (
          <Avatar className="h-8 w-8 mr-2">
            {message.sender.avatar ? (
              <AvatarImage src={message.sender.avatar} alt="profile" />
            ) : (
              <AvatarFallback className="bg-purple-500 text-white uppercase">
                {message.sender.firstName ? message.sender.firstName[0] : message.sender.email[0]}
              </AvatarFallback>
            )}
          </Avatar>
        )}
        <div className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}>
          {!isOwnMessage && (
            <span className="text-sm text-gray-400 mb-1">
              {`${message.sender.firstName} ${message.sender.lastName}`}
            </span>
          )}
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              isOwnMessage ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white" : "bg-[#2a2b33] text-gray-200"
            }`}
          >
            {message.messageType === "text" && <p>{message.content}</p>}
            {message.messageType === "file" && renderFileContent(message.fileUrl)}
          </div>
          <span className="text-gray-500 text-xs mt-1">{moment(message.timestamp).format("LT")}</span>
        </div>
      </motion.div>
    )
  }

  const renderFileContent = (fileUrl) => {
    if (checkIfImage(fileUrl)) {
      return (
        <div
          className="cursor-pointer"
          onClick={() => {
            setShowImage(true)
            setImageUrl(fileUrl)
          }}
        >
          <img src={fileUrl || "/placeholder.svg"} alt="Shared image" className="max-w-full h-auto rounded" />
        </div>
      )
    } else {
      return (
        <div className="flex items-center gap-4">
          <span className="text-white text-2xl bg-black/20 rounded-full p-2">
            <MdFolderZip />
          </span>
          <span className="text-sm max-w-[60%] truncate">{fileUrl.split("/").pop()}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="bg-black/20 p-2 rounded-full hover:bg-black/50 transition-all duration-300"
            onClick={() => handleDownload(fileUrl)}
          >
            <IoMdArrowRoundDown className="text-xl" />
          </motion.button>
        </div>
      )
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full bg-[#1c1d25]">
      {renderMessages()}
      <div ref={scrollRef} />
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm"
          >
            <div className="relative max-w-4xl max-h-[90vh]">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Full size image"
                className="max-w-full max-h-[80vh] object-contain"
              />
              <div className="absolute top-4 right-4 flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all duration-300"
                  onClick={() => handleDownload(imageUrl)}
                >
                  <IoMdArrowRoundDown className="text-white text-xl" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-black/50 p-2 rounded-full hover:bg-black/70 transition-all duration-300"
                  onClick={() => {
                    setShowImage(false)
                    setImageUrl(null)
                  }}
                >
                  <IoCloseSharp className="text-white text-xl" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Chats

