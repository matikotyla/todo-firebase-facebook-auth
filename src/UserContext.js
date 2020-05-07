import React, { useState, createContext } from "react";
import fire from "./firebase";

export const UserContext = createContext();

export const UserProvider = (props) => {
    const [user, setUser] = useState(null);

    fire.auth().onAuthStateChanged((user) => {
        setUser(user);
    });

    return (
        <UserContext.Provider
            value={{
                user,
                setUser,
            }}
        >
            {props.children}
        </UserContext.Provider>
    );
};
