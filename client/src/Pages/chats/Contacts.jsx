import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { getDirectMessagesContacts } from "../../Redux/slices/contactSlice"
import { getUserChannels } from "../../Redux/slices/channelSlice"
import ProfileTab from "./components/ProfileTab"
import { NewDm } from "./components/NewDm"
import ContactList from "./components/ContactList"
import { NewChannel } from "./components/NewChannel"
import MessageSquareCode from "./components/MessageSquareCode"

function Contacts() {
  const dispatch = useDispatch()
  const { directMessagesContacts, contacts } = useSelector((state) => state.contact)
  const { channels } = useSelector((state) => state.channel)

  useEffect(() => {
    const getContactList = async () => {
      await dispatch(getDirectMessagesContacts())
    }
    const getUserChannelList = async () => {
      await dispatch(getUserChannels())
    }
    getContactList()
    getUserChannelList()
  }, [dispatch, contacts])

  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="relative w-full md:w-[35vw] lg:w-[30vw] xl:w-[20vw] text-white bg-gradient-to-b from-[#1b1c24] to-[#2a2b33] border-r-2 border-[#2f303b] flex flex-col h-screen"
    >
      <Logo />
      <div className="flex-grow overflow-y-auto">
        <ContactSection title="Direct Messages" contacts={directMessagesContacts} NewComponent={NewDm} />
        <ContactSection title="Channels" contacts={channels} NewComponent={NewChannel} isChannel={true} />
      </div>
      <ProfileTab />
    </motion.div>
  )
}

const ContactSection = ({ title, contacts, NewComponent, isChannel = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="my-5"
  >
    <div className="flex items-center justify-between px-5 mb-2">
      <Title text={title} />
      <NewComponent />
    </div>
    <div>
      <ContactList contacts={contacts} isChannel={isChannel} />
    </div>
  </motion.div>
)

const Logo = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="h-16 w-fit flex items-center gap-2 px-5 py-3"
  >
    <motion.div
      className="w-10 h-10 bg-purple-600 rounded-lg shadow-lg flex items-center justify-center overflow-hidden"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      animate={{
        y: [0, -5, 0],
      }}
      transition={{
        duration: 1,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      }}
    >
      <MessageSquareCode />
    </motion.div>
    <div className="flex">
      <motion.span
        className="text-white font-extrabold text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Trans
      </motion.span>
      <motion.span
        className="text-purple-600 font-extrabold text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        whileHover={{
          color: ["#9333ea", "#ec4899", "#9333ea"],
          transition: { duration: 1, repeat: Number.POSITIVE_INFINITY },
        }}
      >
        Lingo
      </motion.span>
    </div>
  </motion.div>
)

const Title = ({ text }) => (
  <h6 className="uppercase tracking-widest text-neutral-400 font-light text-opacity-90 text-sm">{text}</h6>
)

export default Contacts

