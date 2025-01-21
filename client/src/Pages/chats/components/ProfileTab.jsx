import React, { useEffect } from "react"
import { motion } from "framer-motion"
import { useDispatch, useSelector } from "react-redux"
import { FaEdit, FaPowerOff, FaUser } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarImage } from "../../../components/ui/avatar"
import { getUserDetails, logoutUser } from "../../../Redux/slices/authSlice"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function ProfileTab() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { userInfo, isLoggedIn } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchUserDetails = async () => {
      await dispatch(getUserDetails() )
    }
    if (isLoggedIn) {
      fetchUserDetails()
    }
  }, [dispatch, isLoggedIn])

  const profileImage = userInfo?.avatar || undefined

  const handleLogout = async () => {
    const response = await dispatch(logoutUser())
    if (response.payload.success) {
      navigate("/")
    }
  }

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center h-full w-full text-white text-lg font-bold"
      >
        Please Login to view your profile.
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-[#2a2b33]"
    >
      <div className="flex gap-3 items-center">
        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
          {profileImage ? (
            <AvatarImage src={profileImage} alt="profile" className="object-cover w-full h-full bg-black" />
          ) : (
            <div className="w-12 h-12 rounded-full text-white bg-purple-600 text-2xl flex items-center justify-center uppercase">
              {userInfo?.firstName ? userInfo.firstName.charAt(0) : userInfo?.email?.charAt(0)}
            </div>
          )}
        </Avatar>
        <div className="text-white font-bold text-sm">
          {userInfo?.firstName
            ? `${userInfo.firstName.toUpperCase()} ${userInfo.lastName?.toUpperCase()}`
            : userInfo?.email}
        </div>
      </div>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-purple-400 cursor-pointer"
                onClick={() => navigate("/signup")}
              >
                <FaEdit />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-2 text-white">Edit Profile</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-red-400 cursor-pointer"
                onClick={handleLogout}
              >
                <FaPowerOff />
              </motion.button>
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-2 text-white">Logout</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}

export default ProfileTab

