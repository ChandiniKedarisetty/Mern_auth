import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify"; 

export const AppContext = createContext();

export const AppContextProvider = (props) => {
     axios.defaults.withCredentials=true;

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [userData, setUserData] = useState(null); 

    const getAuthState= async()=>{
        try{

            const {data} = await axios.get(backendUrl + '/api/auth/is-auth')
            if(data.success){
                setIsLoggedin(true)
                getUserData()
            }

        }catch(error){
            toast.error(error.message)
        }
    }

    const getUserData = async () => {
        try {
            const response = await axios.get(backendUrl + "/api/user/data", { withCredentials: true });

            if (response.data.success) {
                setUserData(response.data.userData);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch user data");
        }
    };
    useEffect(()=>{
        getAuthState();
    },[])

    const value = {
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getUserData, 
    };

    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
