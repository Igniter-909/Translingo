import { createContext, useEffect, useRef, useContext, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client"
import { addChatMessage } from "./Redux/slices/chatSlice";
import { addChannelInChannelList } from "./Redux/slices/channelSlice";
import { addDMInDMList } from "./Redux/slices/contactSlice";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
  const socket = useRef();
  const dispatch = useDispatch();
  const { userInfo } = useSelector(state => state.auth);
  const { selectedChatData, selectedChatType } = useSelector(state => state.chat);

  const handleReceiveMessage = useCallback((message) => {
    console.log('Received message:', message);
    if (selectedChatType !== undefined && 
        (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
      console.log("Dispatching received message");
      dispatch(addChatMessage(message));
      dispatch(addDMInDMList(message))
    }

  }, [dispatch, selectedChatData, selectedChatType]);

  const handleChannelReceiveMessage = useCallback((message) => {
    console.log('Received message:', message);
    if (selectedChatType !== undefined && 
        (selectedChatData._id === message.channelId )) {
      console.log("Dispatching received message");
      dispatch(addChatMessage(message));
      dispatch(addChannelInChannelList(message));
    }
  }, [dispatch, selectedChatData, selectedChatType]);

  useEffect(() => {
    if (userInfo) {
      const SOCKET_SERVER_URL = "https://translingo-pcgl.onrender.com";
      
      socket.current = io(SOCKET_SERVER_URL, {
        withCredentials: true,
        query: { userId: userInfo._id }
      });

      socket.current.on('connect', () => {
        console.log('Connected to the socket server', socket.current.id);
      });

      socket.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      socket.current.on("receiveMessage", handleReceiveMessage);
      socket.current.on("receive-channel-message",handleChannelReceiveMessage)

      return () => {
        if (socket.current) {
          socket.current.off("receiveMessage", handleReceiveMessage);
          socket.current.disconnect();
        }
      }
    }
  }, [userInfo, handleReceiveMessage]);

  const emitMessage = useCallback((eventName, data) => {
    if (socket.current) {
      socket.current.emit(eventName, data);
    } else {
      console.error('Socket is not initialized');
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socket.current, emitMessage }}>
      {children}
    </SocketContext.Provider>
  )
}