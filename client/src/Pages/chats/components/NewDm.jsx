import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { FaPlus, FaSearch } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "../../../components/ui/scroll-area"
import { Avatar, AvatarImage } from "../../../components/ui/avatar"
import { Input } from "../../../components/ui/input"
import { getSearchedContacts } from "../../../Redux/slices/contactSlice"
import { setSelectedChatData, setSelectedChatType } from "../../../Redux/slices/chatSlice"

export const NewDm = () => {
  const dispatch = useDispatch()
  const { contacts } = useSelector((state) => state.contact)
  const [openNewModal, setOpenNewModal] = useState(false)
  const [searchedContacts, setSearchedContacts] = useState([])

  const searchContacts = async (searchTerm) => {
    try {
      await dispatch(getSearchedContacts({ searchTerm }))
      setSearchedContacts(contacts)
    } catch (error) {
      console.error("Could not search contacts", error)
    }
  }

  const selectNewContact = (contact) => {
    setOpenNewModal(false)
    dispatch(setSelectedChatType("contact"))
    dispatch(setSelectedChatData(contact))
    setSearchedContacts([])
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FaPlus
                className="text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all"
                onClick={() => setOpenNewModal(true)}
              />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">New DM</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[90vw] max-w-[400px] h-[80vh] max-h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mb-4">Select a contact</DialogTitle>
          </DialogHeader>
          <div className="relative mb-4">
            <Input
              placeholder="Search contact"
              className="bg-[#2c2e3b] rounded-lg border-none pl-10 pr-4 py-2 w-full"
              onChange={(e) => searchContacts(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          </div>
          <ScrollArea className="flex-grow">
            <AnimatePresence>
              {searchedContacts.map((contact) => (
                <motion.div
                  key={contact._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => selectNewContact(contact)}
                  className="flex items-center cursor-pointer gap-3 p-3 hover:bg-[#2c2e3b] rounded-lg transition-all duration-300"
                >
                  <Avatar className="w-12 h-12 rounded-full overflow-hidden">
                    {contact.avatar ? (
                      <AvatarImage src={contact.avatar} alt="profile" className="object-cover w-full h-full bg-black" />
                    ) : (
                      <div className="w-12 h-12 rounded-full text-white bg-purple-600 text-2xl flex items-center justify-center uppercase">
                        {contact.firstName ? contact.firstName.charAt(0) : contact.email.charAt(0)}
                      </div>
                    )}
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-semibold">
                      {contact.firstName && contact.lastName
                        ? `${contact.firstName} ${contact.lastName}`
                        : contact.email}
                    </span>
                    <span className="text-xs text-neutral-400">{contact.email}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>
          {searchedContacts.length <= 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col justify-center items-center"
            >
              <FaSearch className="text-6xl text-purple-600 mb-4" />
              <h3 className="font-light text-xl text-center">
                No<span className="text-purple-600"> Contacts Found</span>
              </h3>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

