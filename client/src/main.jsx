import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import {Toaster} from "./components/ui/sonner.jsx"
import { Provider } from "react-redux";
import './index.css'
import App from './App.jsx'
import store from './Redux/store.js'
import { SocketProvider } from './context.jsx';

createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
       <SocketProvider>
    <BrowserRouter>
      <App />
      <Toaster closeButton />
    </BrowserRouter>
    </SocketProvider>
    </Provider>
)
