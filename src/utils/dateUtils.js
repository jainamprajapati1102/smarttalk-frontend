export const formatMessageDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  
  export const formatChatTime = (date) => {
    if (!date) return "";
  
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    if (d.toDateString() === today.toDateString()) {
      // Same day → show time
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
  
    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
  
    // Older → show date
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  