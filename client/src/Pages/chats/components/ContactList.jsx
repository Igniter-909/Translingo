import React from "react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, AvatarImage } from "../../../components/ui/avatar"
import { setSelectedChatData, setSelectedChatType, setSelectedChatMessages } from "../../../Redux/slices/chatSlice"

function ContactList({ contacts, isChannel = false }) {
  const { selectedChatType, selectedChatData, selectedChatMessages } = useSelector((state) => state.chat)
  const dispatch = useDispatch()

  const handleClick = (contact) => {
    if (isChannel) {
      dispatch(setSelectedChatType("channel"))
    } else {
      dispatch(setSelectedChatType("contact"))
    }
    dispatch(setSelectedChatData(contact))
    if (selectedChatData && selectedChatData._id !== contact._id) {
      dispatch(setSelectedChatMessages([]))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`mt-5 space-y-2 px-4 ${isChannel ? "pb-[10vh]": ""}`}
    >
      {contacts.map((contact) => (
        <motion.div
          key={contact._id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`py-3 rounded-lg transition-all duration-300 cursor-pointer ${
            selectedChatData && selectedChatData._id === contact._id
              ? "bg-gradient-to-r from-[#8417ff] to-[#a517ff] shadow-lg"
              : "hover:bg-[#f1f1f111]"
          }`}
          onClick={() => handleClick(contact)}
        >
          <div className="flex gap-4 items-center justify-start text-white">
            {!isChannel ? (
              <Avatar className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-400">
                {contact.avatar ? (
                  <AvatarImage src={contact.avatar} alt="profile" className="object-cover w-full h-full bg-black" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-lg flex items-center justify-center uppercase">
                    {contact?.firstName ? contact?.firstName.charAt(0) : contact?.email.charAt(0)}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 h-10 w-10 flex items-center justify-center rounded-full text-white font-bold">
                #
              </div>
            )}
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold truncate">
                {isChannel ? contact.name : `${contact.firstName} ${contact.lastName}`}
              </span>
              {!isChannel && <span className="text-xs text-gray-300 truncate">{contact.email}</span>}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}

export default ContactList

