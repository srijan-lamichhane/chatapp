import {createContext, useState, useEffect , useContext} from 'react'
import { useAuthContext } from './AuthContext';
import io from 'socket.io-client';

export const SocketContext = createContext(); // socketContext will act as a container for the shared state

//hook
export const useSocketContext = () => {
    return useContext(SocketContext);
}

//(context) here we will provide some value that we can use throughout our application.
export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { authUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socket = io("http://localhost:5000",{
                query: {
                    userId: authUser._id,
                },
            });

            setSocket(socket);

            socket.on("getOnlineUsers", (users) => {
                setOnlineUsers(users);
            });
            return () => socket.close();
        }else {
            if(socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    return <SocketContext.Provider value={{socket, onlineUsers }}>
        {children}
    </SocketContext.Provider>;
};
