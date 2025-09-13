import { useEffect } from "react";
import { useUserChat } from "../context/UserChatContext";

const TitleUpdater = () => {
  const { userChat } = useUserChat();
  const totalUnseen = userChat?.reduce(
    (sum, chat) => sum + (chat.unseenCount || 0),
    0
  );
  useEffect(() => {
    if (totalUnseen > 0) {
      document.title = `(${totalUnseen}) SmartTalks`;
    } else {
      document.title = "SmartTalks";
    }
  }, [totalUnseen]);

  return null;
};

export default TitleUpdater;
