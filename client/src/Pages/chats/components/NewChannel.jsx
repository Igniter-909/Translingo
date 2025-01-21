import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { FaPlus, FaUsers } from "react-icons/fa"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { getAllContact } from "../../../Redux/slices/contactSlice"
import { createNewChannel } from "../../../Redux/slices/channelSlice.js"
import MultipleSelector from "../../../components/ui/multipleselect"

export const NewChannel = () => {
  const dispatch = useDispatch()
  const [newChannelModal, setNewChannelModal] = useState(false)
  const [allContacts, setAllContacts] = useState([])
  const [channelName, setChannelName] = useState("")
  const [selectedContacts, setSelectedContacts] = useState([])

  useEffect(() => {
    const getAllContacts = async () => {
      const response = await dispatch(getAllContact())
      setAllContacts(response.payload?.data)
    }
    getAllContacts()
  }, [])

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedContacts.length > 0) {
        const response = await dispatch(
          createNewChannel({
            name: channelName,
            members: selectedContacts.map((contact) => contact.value),
          }),
        )
        if (response.payload.statusCode === 201) {
          setChannelName("")
          setSelectedContacts([])
          setNewChannelModal(false)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <FaPlus
                className="text-neutral-400 hover:text-neutral-100 cursor-pointer transition-all"
                onClick={() => setNewChannelModal(true)}
              />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">New Channel</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={newChannelModal} onOpenChange={setNewChannelModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[90vw] max-w-[400px] h-[80vh] max-h-[400px] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold mb-4">Create a new channel</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 flex-grow">
            <Input
              placeholder="Channel name"
              className="bg-[#2c2e3b] rounded-lg border-none py-2"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
            />
            <MultipleSelector
              className="rounded-lg bg-[#2c2e3b] border-none py-2 text-white"
              defaultOptions={allContacts}
              placeholder="Search contacts"
              value={selectedContacts}
              onChange={setSelectedContacts}
              emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600">No contacts found</p>}
            />
          </div>
          <Button
            className="w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300 mt-4"
            onClick={createChannel}
          >
            <FaUsers className="mr-2" />
            Create Channel
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}

