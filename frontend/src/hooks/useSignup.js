import React, { useState } from 'react'
import toast from 'react-hot-toast';

const useSignup = () => {
    const [loading, setLoading] = useState(false);

    const signup = async ({ fullName, username, password, confirmPassword, gender }) => {
        // handle input errors for validation
        const sucess = handleInputErrors({ fullName, username, password, confirmPassword, gender });
        if (!sucess) return;

        setLoading(true)
        try {
            // fetch the api
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ fullName, username, password, confirmPassword, gender }), // spent days on this error, gender field not included in the request body while making an api call
            })

            // extract the data from the response
            const data = await res.json();
            console.log(data);

        }

        catch (error) {
            toast.error(error.message);
        }
        finally {
            setLoading(false);
        }

    }

    return { signup , loading};
}

export default useSignup

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
    // if empty fields return false
    if (!fullName || !username || !password || !confirmPassword || !gender) {
        toast.error('Please fill all fields');
        return false;
    }
    // check if password matches confirmPassword
    if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return false;
    }
    // check if password is less than 6 characters
    if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
    }
    // check if user already exists
    // if (user) { // user not defined
    //     toast.error('User already exists')
    // }

    return true;
}
