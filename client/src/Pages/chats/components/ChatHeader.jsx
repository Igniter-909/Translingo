import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCloseFill } from "react-icons/ri"
import { useDispatch, useSelector } from 'react-redux'
import { closeChat } from '../../../Redux/slices/chatSlice'
import { Avatar, AvatarImage } from '../../../components/ui/avatar'
import { Trash2Icon, UserMinus, Users2Icon } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '../../../components/ui/button'
import { addMember, deleteChannel, removeMember } from '../../../Redux/slices/channelSlice'
import { toast } from "sonner"
import { getAllContact, getChannelDetail } from '../../../Redux/slices/contactSlice'
import { Input } from '../../../components/ui/input'

function ChatHeader() {
  const dispatch = useDispatch()
  const { userInfo } = useSelector((state) => state.auth)
  const { selectedChatData, selectedChatType } = useSelector((state) => state.chat)
  const { channels } = useSelector((state) => state.channel)
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false)
  const [members, setMembers] = useState([])
  const [openAddMember, setOpenAddMember] = useState(false)
  const [membersMenu, setMembersMenu] = useState(false)
  const [allContacts, setAllContacts] = useState([])

  useEffect(() => {
    const fetchChannelDetails = async () => {
      const response = await dispatch(getChannelDetail({
        channelId: selectedChatData._id
      }))
      if (response?.payload?.success) {
        setMembers(response.payload?.data?.members)
      }
    }
    fetchChannelDetails()
  }, [selectedChatData, channels, dispatch])

  useEffect(() => {
    const fetchAllContacts = async () => {
      const response = await dispatch(getAllContact())
      setAllContacts(response?.payload?.data)
    }
    fetchAllContacts()
  }, [dispatch])

  const handleChatClose = async () => {
    await dispatch(closeChat())
    setMembers([])
  }

  const handleMembers = () => {
    setMembersMenu(!membersMenu)
  }

  const handleRemoveMember = async (member) => {
    const response = await dispatch(removeMember({
      channelId: selectedChatData._id,
      memberId: member._id
    }))
    if (response?.payload?.success) {
      setMembers(members.filter((m) => m._id !== member._id))
    }
  }

  const handleDeleteChannel = () => {
    setShowDeleteChannelModal(true)
  }

  const DeleteChannel = async () => {
    await dispatch(deleteChannel({
      channelId: selectedChatData._id
    }))
    setShowDeleteChannelModal(false)
    handleChatClose()
    toast.success("Channel deleted successfully")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='relative h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-5 bg-gradient-to-r from-[#1c1d25] to-[#2a2b33]'
    >
      <div className='flex items-center gap-4'>
        {selectedChatType === "contact" ? (
          <Avatar className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500">
            {selectedChatData.avatar ? (
              <AvatarImage src={selectedChatData.avatar} alt="profile" className="object-cover w-full h-full" />
            ) : (
              <div className='w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl flex items-center justify-center uppercase'>
                {selectedChatData.firstName ? selectedChatData.firstName[0] : selectedChatData?.email[0]}
              </div>
            )}
          </Avatar>
        ) : (
          <div className='bg-gradient-to-br from-purple-500 to-pink-500 h-12 w-12 flex items-center justify-center rounded-full text-white font-bold text-2xl'>
            #
          </div>
        )}
        <div className='flex flex-col'>
          <h2 className='text-white font-bold text-lg'>
            {selectedChatType === "contact"
              ? `${selectedChatData?.firstName || ''} ${selectedChatData?.lastName || ''}`.trim() || selectedChatData?.email
              : selectedChatData?.name?.toUpperCase()}
          </h2>
          {selectedChatType === "contact" && (
            <p className='text-gray-400 text-sm'>{selectedChatData?.email}</p>
          )}
        </div>
      </div>
      <div className='flex items-center gap-4'>
        {(selectedChatType === 'channel' && selectedChatData.admin === userInfo._id) && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='text-red-400 hover:text-red-300 focus:outline-none'
            onClick={handleDeleteChannel}
          >
            <Trash2Icon />
          </motion.button>
        )}
        {selectedChatType === "channel" && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className='text-purple-400 hover:text-purple-300 focus:outline-none'
            onClick={handleMembers}
          >
            <Users2Icon />
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className='text-gray-400 hover:text-gray-300 focus:outline-none'
          onClick={handleChatClose}
        >
          <RiCloseFill className="text-3xl" />
        </motion.button>
      </div>

      <AnimatePresence>
        {membersMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className='absolute right-6 top-20 w-80 bg-[#2a2b33] rounded-lg py-4 px-4 shadow-lg'
          >
            <h3 className='font-sans text-xl text-white mb-4'>Members</h3>
            <div className='max-h-60 overflow-y-auto'>
              {members && members.length > 0 ? (
                members.map((member) => (
                  <div key={member._id} className='flex items-center justify-between mb-3 bg-[#1c1d25] p-2 rounded-lg'>
                    <div className='flex items-center gap-3'>
                      <Avatar className="w-10 h-10 rounded-full overflow-hidden">
                        {member.avatar ? (
                          <AvatarImage src={member.avatar} alt="profile" className="object-cover w-full h-full" />
                        ) : (
                          <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl flex items-center justify-center uppercase'>
                            {member.firstName ? member.firstName[0] : member.email[0]}
                          </div>
                        )}
                      </Avatar>
                      <div>
                        <p className='text-white text-sm font-semibold'>
                          {member.firstName ? `${member.firstName} ${member.lastName}` : member.email}
                        </p>
                        <p className='text-gray-400 text-xs'>{member.email}</p>
                      </div>
                    </div>
                    {member._id === selectedChatData.admin ? (
                      <span className='text-red-400 text-xs font-semibold'>Admin</span>
                    ) : (
                      selectedChatData.admin === userInfo._id && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className='text-red-400 hover:text-red-300'
                          onClick={() => handleRemoveMember(member)}
                        >
                          <UserMinus size={16} />
                        </motion.button>
                      )
                    )}
                  </div>
                ))
              ) : (
                <p className='text-gray-400'>No members available</p>
              )}
            </div>
            {selectedChatData.admin === userInfo._id && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='bg-gradient-to-r from-purple-500 to-pink-500 mt-4 py-2 rounded-lg w-full text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300'
                onClick={() => setOpenAddMember(true)}
              >
                Add Members
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={showDeleteChannelModal} onOpenChange={setShowDeleteChannelModal}>
        <DialogContent className="bg-[#1c1d25] border-none text-white w-[90vw] max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Delete Channel?</DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              This action cannot be undone. This will permanently delete the channel
              and remove all associated chats from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className='flex items-center justify-between mt-6'>
            <Button className="bg-red-600 text-white hover:bg-red-700 transition-all duration-200" onClick={DeleteChannel}>Delete</Button>
            <Button className="bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200" onClick={() => setShowDeleteChannelModal(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openAddMember} onOpenChange={setOpenAddMember}>
        <DialogContent className="bg-[#1c1d25] border-none text-white w-[90vw] max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center mb-4">Add a member</DialogTitle>
            <Input
              placeholder="Search Contacts"
              className="w-full p-2 bg-[#2a2b33] border-none text-white placeholder-gray-400"
              onChange={(e) => {
                const searchValue = e.target.value.toLowerCase();
                const filteredContacts = allContacts.filter((contact) =>
                  contact.label?.toLowerCase().includes(searchValue)
                );
                setAllContacts(filteredContacts);
              }}
            />
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-2 max-h-64 overflow-y-auto">
            {allContacts.length > 0 ? (
              allContacts.map((contact, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between gap-4 bg-[#2a2b33] p-3 rounded-lg"
                >
                  <span className="text-white font-semibold text-sm">{contact.label}</span>
                  <Button
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 text-xs px-3 py-1 rounded-md"
                    onClick={async () => {
                      const response = await dispatch(
                        addMember({
                          channelId: selectedChatData._id,
                          memberId: contact.value,
                        })
                      );
                      if (response?.payload?.success) {
                        toast.success(`${contact.label} added successfully`);
                      }
                    }}
                  >
                    Add
                  </Button>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-400">No contacts available</p>
            )}
          </div>
          <Button
            className="mt-4 bg-gray-600 text-white hover:bg-gray-700 transition-all duration-200"
            onClick={() => setOpenAddMember(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

export default ChatHeader
