import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext';

const useLogin = () => {

    const [loading, setLoading] = useState(false)
    const { setAuthUser } = useAuthContext()

    const login = async (username, password) => {
        const sucess = handleInputErrors(username, password );
        if (!sucess) return;

        setLoading(true)
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }), // this was missing so unauthorized token error
            });

            const data = await res.json()
            if (data.error) {
                throw new Error(data.error)
            }
            localStorage.setItem("chat-user", JSON.stringify({ username, password }))
            setAuthUser(data)

        } catch (error) {
            toast.error(error.message)

        } finally {
            setLoading(false)
        }


    }
    return { loading, login }

}

export default useLogin

function handleInputErrors(username, password) {
    // if empty fields return false
    if (!username || !password) {
        toast.error('Please fill all fields');
        return false;
    }
    return true;
}
