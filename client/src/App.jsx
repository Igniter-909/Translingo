import { Button } from './components/ui/button'
import { Route, Routes } from "react-router-dom"
import Homepage from './Pages/Homepage'
import Signup from './Pages/Signup'
import Container from './Pages/chats/Container'
import ForgotPassword from './Pages/ForgotPassword'

function App() {
  return (
   <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="forgotPassword" element={<ForgotPassword />} />
      <Route path='/signup' element={<Signup />} />
      <Route path="/chat" element={<Container />} />
   </Routes>
  )
}

export default App
