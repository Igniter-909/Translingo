import React from "react"
import Lottie from "react-lottie"
import { motion } from "framer-motion"
import animationData from "../../assets/lottie-json.json"

function EmptyContainer() {
  return (
    <motion.div
      className="bg-gradient-to-br from-[#1c1d25] to-[#2a2b36] w-full flex-1 flex flex-col justify-center items-center min-h-screen p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Lottie
          isClickToPauseDisabled={true}
          height={300}
          width={300}
          options={{
            loop: true,
            autoplay: true,
            animationData,
          }}
        />
      </motion.div>
      <motion.div
        className="text-white flex flex-col gap-5 items-center mt-10 text-center"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <motion.h3
          className="font-bold text-3xl sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600"
          whileHover={{ scale: 1.05 }}
        >
          Hi<span className="text-purple-600">!</span> Welcome to <span className="text-purple-600">Translingo</span>
        </motion.h3>
        <motion.p
          className="text-base sm:text-lg md:text-xl font-light text-gray-300 max-w-md"
          whileHover={{ scale: 1.05 }}
        >
          Chatting made simpler without <span className="text-purple-400">language</span> barriers.
        </motion.p>
      </motion.div>
    </motion.div>
  )
}

export default EmptyContainer

