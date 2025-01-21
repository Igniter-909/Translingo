import React, { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loginUser, resetPassword, signupUser } from "../Redux/slices/authSlice.js"
import { toast } from "sonner"
import { motion } from "framer-motion"

// Assuming HOMEPAGE is imported correctly
import HOMEPAGE from "../assets/HOMEPAGE.jpeg"
import { ArrowLeft } from "lucide-react"

function ForgotPassword() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isLoggedIn } = useSelector((state) => state.auth)

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/signup")
    }
  }, [isLoggedIn, navigate])

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [age,setAge] = useState("")

  const handleReset = async () => {
    if (!email) {
      toast.error("Please enter email!")
      return
    }
    if (!password) {
      toast.error("Please enter new password!")
      return
    }
    if(!age){
        toast.error("Age is required for resetting the password!")
        return
    }
    if (password.length < 8) {
      toast.error("Password should be at least 8 characters long!")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!")
      return
    }
    const response = await dispatch(
      resetPassword({
        email,
        newPassword:password,
        age
      }),
    )
    if (response.payload.success) {
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setAge("")
      navigate("/")
    }
  }

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: `url(${HOMEPAGE})`,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-[2px]"></div>
      <MovingChats />
      <div className="grid grid-cols-1 w-11/12 max-w-md lg:max-w-lg xl:max-w-xl bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl z-10 p-8 md:p-12">
        <div className="h-full w-full rounded-3xl flex flex-col items-center gap-6 justify-center">
        <div className="absolute top-4 right-4">
        <Button
        className="rounded-full p-2 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
        onClick={() => navigate("/")}
        >
            <ArrowLeft/>
        </Button>
        </div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-3xl sm:text-4xl md:text-5xl text-indigo-800"
          >
            Welcome to Translingo
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-base text-gray-600 text-center"
          >
            Chat without language barriers instantly.
          </motion.p>
          <div className="flex items-center justify-center w-full mt-4">
            <Tabs defaultValue="forgotPassword" className="w-full">
              <TabsList className="bg-indigo-100 rounded-full w-full p-1">
                <TabsTrigger
                  className="w-1/2 data-[state=active]:bg-white data-[state=active]:text-indigo-800 rounded-full transition-all duration-300"
                  value="forgotPassword"
                >
                  Reset Password
                </TabsTrigger>
              </TabsList>
              <TabsContent value="forgotPassword" className="flex flex-col gap-4 mt-6">
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  className="rounded-full p-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Age"
                  type="number"
                  value={age}
                  className="rounded-full p-6"
                  onChange={(e) => setAge(e.target.value)}
                />
                <Input
                  placeholder="New password"
                  type="password"
                  value={password}
                  className="rounded-full p-6"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  className="rounded-full p-6"
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button
                  className="rounded-full p-6 bg-indigo-600 hover:bg-indigo-700 transition-all duration-300"
                  onClick={handleReset}
                >
                  Reset
                </Button>
                
              </TabsContent>
            </Tabs>
          </div>
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

export default ForgotPassword

