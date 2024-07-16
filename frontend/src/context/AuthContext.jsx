import React, {createContext, useContext, useState } from 'react'

export const AuthContext = createContext();

//lets create hook (to be able to consume the value of authcontextprovider)
export const useAuthContext = () => {
    return useContext(AuthContext);
}

//(context) here we will provide some value that we can use throughout our application.
export const AuthContextProvider = ({ children }) => {
    const [authUser, setAuthUser] = useState(
        JSON.parse(localStorage.getItem("chat-user") || null) // json parse to return as an obj (not string)
    )

    return <AuthContext.Provider value={{authUser, setAuthUser}}>
        {children}
    </AuthContext.Provider>
} 
