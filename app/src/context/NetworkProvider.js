import React, { createContext, useRef, useContext, useState, useEffect } from 'react'
export const AppContext = createContext()
import NetInfo from "@react-native-community/netinfo";
const NetworkProvider = ({ children }) => {

    const [networkStatus, setNetworkStatus] = useState()

    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setNetworkStatus(state.isConnected)
            console.log("network-----------", state);
        });
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <AppContext.Provider value={{ networkStatus }}>
            {children}
        </AppContext.Provider>
    )
}

export default NetworkProvider


export const useAppNetworkContext = () => {
    return useContext(AppContext)
}