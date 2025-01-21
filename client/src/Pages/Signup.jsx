import React, { useEffect, useState } from "react"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { FaTrash, FaPlus } from "react-icons/fa"
import { Avatar, AvatarImage } from "../components/ui/avatar"
import { useDispatch, useSelector } from "react-redux"
import { deleteAvatar, getUserDetails, updateUserAvatar, updateUserDetails } from "../Redux/slices/authSlice.js"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

// Assuming SIGNUP_BG is imported correctly
import SIGNUP_BG from "../assets/SIGNUP_BG.jpeg"

function Signup() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn, userInfo } = useSelector((state) => state.auth)

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("Please login first...")
      navigate("/")
    }
  }, [isLoggedIn, navigate])

  useEffect(() => {
    const getUser = async () => {
      await dispatch(getUserDetails())
    }
    getUser()
  }, [dispatch])

  const [firstName, setFirstName] = useState(userInfo?.firstName || "")
  const [lastName, setLastName] = useState(userInfo?.lastName || "")
  const [age, setAge] = useState(userInfo?.age || "")
  const [hovered, setHovered] = useState(false)
  const [profileImage, setProfileImage] = useState(userInfo?.avatar || "")
  const [avatar, setAvatar] = useState("")
  const [showUploadField, setShowUploadField] = useState(false)

  useEffect(() => {
    setFirstName(userInfo?.firstName || "")
    setLastName(userInfo?.lastName || "")
    setAge(userInfo?.age || "")
    setProfileImage(userInfo?.avatar || "")
  }, [userInfo])

  const handleSignUp = async (e) => {
    e.preventDefault()
    if (!firstName || !lastName || !age) {
      toast.error("Please fill all fields")
      return
    }
    const response = await dispatch(
      updateUserDetails({
        firstName: firstName.trim().toLowerCase(),
        lastName: lastName.trim().toLowerCase(),
        age,
      }),
    )
    if (response?.payload?.success) {
      toast.success("Profile updated successfully")
      setFirstName("")
      setLastName("")
      setAge("")
      navigate("/chat")
    }
  }

  const handleImageChange = async (e) => {
    const uploadedImage = e.target.files[0]
    if (uploadedImage) {
      setAvatar(uploadedImage)
    }
    const fileReader = new FileReader()
    fileReader.readAsDataURL(uploadedImage)
    fileReader.addEventListener("load", function () {
      setProfileImage(this.result)
    })
    const formData = new FormData()
    formData.append("avatar", uploadedImage)
    const response = await dispatch(updateUserAvatar(formData))
    if (response?.payload?.success) {
      toast.success("Avatar updated successfully")
    }
    setShowUploadField(false)
  }

  const handleDelete = async () => {
    const response = await dispatch(deleteAvatar())
    if (response?.payload?.success) {
      toast.success("Avatar deleted successfully")
      setProfileImage("")
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${SIGNUP_BG})`,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-[2px]"></div>
      <MovingChats />
      <div className="flex flex-col justify-center items-center w-11/12 max-w-4xl bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl z-10 p-8 md:p-12 gap-6">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="font-bold text-3xl sm:text-4xl md:text-5xl text-indigo-800"
        >
          Trans<span className="text-purple-600">Lingo</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm md:text-base text-gray-600 text-center"
        >
          Complete Signup to get started
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <div className="flex flex-col items-center justify-center">
            <div
              className="relative w-32 h-32 md:w-48 md:h-48 flex items-center justify-center"
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <Avatar className="w-full h-full rounded-full overflow-hidden border-4 border-indigo-200">
                {profileImage ? (
                  <AvatarImage src={profileImage} alt="profile" className="object-cover w-full h-full bg-black" />
                ) : (
                  <div className="w-full h-full rounded-full bg-indigo-100 text-indigo-800 text-4xl md:text-6xl flex items-center justify-center uppercase">
                    {firstName ? firstName.charAt(0) : userInfo?.data?.user?.email.charAt(0)}
                  </div>
                )}
              </Avatar>
              {hovered && (
                <div className="absolute rounded-full inset-0 flex items-center justify-center bg-black/50 transition-all duration-300">
                  {profileImage ? (
                    <button
                      className="text-3xl md:text-5xl text-white cursor-pointer hover:text-red-500 transition-colors duration-300"
                      onClick={handleDelete}
                    >
                      <FaTrash />
                    </button>
                  ) : (
                    <div className="text-white text-3xl md:text-5xl cursor-pointer hover:text-green-400 transition-colors duration-300">
                      <label htmlFor="avatar">
                        <FaPlus className="cursor-pointer" />
                      </label>
                      <input type="file" name="avatar" id="avatar" onChange={handleImageChange} className="hidden" />
                    </div>
                  )}
                </div>
              )}
            </div>
            {showUploadField && (
              <input
                type="file"
                accept="image/*"
                className="file-input rounded-md mt-4 p-2 border border-indigo-200"
                onChange={handleImageChange}
              />
            )}
          </div>
          <form className="w-full grid grid-cols-1 gap-4">
            <Input
              placeholder="First Name"
              type="text"
              value={firstName}
              className="rounded-full p-6 bg-white/50 backdrop-blur-sm border-indigo-200"
              onChange={(e) => setFirstName(e.target.value)}
            />
            <Input
              placeholder="Last Name"
              type="text"
              value={lastName}
              className="rounded-full p-6 bg-white/50 backdrop-blur-sm border-indigo-200"
              onChange={(e) => setLastName(e.target.value)}
            />
            <Input
              placeholder="Age"
              type="number"
              value={age}
              className="rounded-full p-6 bg-white/50 backdrop-blur-sm border-indigo-200"
              onChange={(e) => setAge(e.target.value)}
            />
            <Button
              className="rounded-full p-6 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 text-white"
              type="submit"
              onClick={handleSignUp}
            >
              Save Changes
            </Button>
            <Button
              className="rounded-full p-6 bg-purple-600 hover:bg-purple-700 transition-all duration-300 text-white"
              onClick={() => navigate("/chat")}
            >
              Go to Chats
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function MovingChats() {
  const chatBubbles = [
    { text: "Hello! How are you today?", language: "English" },
    { text: "Bonjour! Comment allez-vous aujourd'hui?", language: "French" },
    { text: "¡Hola! ¿Cómo estás hoy?", language: "Spanish" },
    { text: "Ciao! Come stai oggi?", language: "Italian" },
    { text: "Hallo! Wie geht es dir heute?", language: "German" },
    { text: "こんにちは！今日の調子はどうですか？", language: "Japanese" },
    { text: "你好！今天感觉如何？", language: "Chinese" },
    { text: "Olá! Como está você hoje?", language: "Portuguese" },
    { text: "Здравствуйте! Как ваши дела сегодня?", language: "Russian" },
    { text: "مرحبا! كيف حالك اليوم؟", language: "Arabic" },
    { text: "Hej! Hur mår du idag?", language: "Swedish" },
    { text: "Merhaba! Bugün nasılsın?", language: "Turkish" },
  ]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {chatBubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border-2 border-white/50"
          style={{
            fontSize: `${Math.max(0.8, Math.min(1.2, bubble.text.length / 20))}rem`,
            maxWidth: `${Math.max(150, Math.min(300, bubble.text.length * 8))}px`,
          }}
          initial={{
            x: Math.random() < 0.5 ? -300 : window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            opacity: 0,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: Math.random() < 0.5 ? window.innerWidth : -300,
            y: Math.random() * window.innerHeight,
            scale: [1, 1.05, 1],
            opacity: [0.8, 1, 0.8],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: Math.random() * 30 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            ease: "linear",
            scale: {
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            opacity: {
              duration: 5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
            rotate: {
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            },
          }}
        >
          <p className="font-semibold mb-1">{bubble.text}</p>
          <p className="text-xs text-gray-500">{bubble.language}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default Signup

