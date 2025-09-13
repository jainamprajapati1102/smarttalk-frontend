import React, { createContext, useState, useContext } from "react";

const UserChatContext = createContext();

export const UserChatProvider = ({ children }) => {
  const [userChat, setUserChat] = useState(null);

  return (
    <UserChatContext.Provider value={{ userChat, setUserChat }}>
      {children}
    </UserChatContext.Provider>
  );
};

export const useUserChat = () => useContext(UserChatContext);
