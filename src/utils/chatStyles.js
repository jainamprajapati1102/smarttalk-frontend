// // utils/chatStyles.js
// export const getBubbleClass = (isSender, isImage) => {
//     if (isImage) {
//       // Images don't usually have a triangle
//       return isSender ? "self-end ml-auto" : "self-start";
//     }

//     const base =
//       "relative rounded-xl p-2 sm:p-3 max-w-[70%] sm:max-w-[60%] md:max-w-[50%]";

//     const senderStyle = `
//       bg-green-200 self-end ml-auto text-right
//       before:content-[''] before:absolute before:top-3 before:right-[-8px]
//       before:border-[8px] before:border-transparent before:border-l-green-200
//     `;

//     const receiverStyle = `
//       bg-white self-start text-left
//       before:content-[''] before:absolute before:top-3 before:left-[-8px]
//       before:border-[8px] before:border-transparent before:border-r-white
//     `;

//     return `${base} ${isSender ? senderStyle : receiverStyle}`;
//   };

// utils/chatStyles.js
export const getBubbleClass = (isSender, isImage) => {
  if (isImage) {
    return isSender ? "self-end ml-auto" : "self-start";
  }

  const base =
    "relative rounded-xl p-2 sm:p-3 max-w-[70%] sm:max-w-[60%] md:max-w-[50%]";

  const senderStyle = `
    self-end ml-auto text-right
    bg-green-200
    before:content-[''] before:absolute before:top-3 before:right-[-8px]
    before:border-[8px] before:border-transparent
    before:border-l-[8px] before:border-l-[var(--bubble-color)]
    [--bubble-color:theme(colors.green.200)]
  `;

  const receiverStyle = `
    self-start text-left
    bg-white
    before:content-[''] before:absolute before:top-3 before:left-[-8px]
    before:border-[8px] before:border-transparent
    before:border-r-[8px] before:border-r-[var(--bubble-color)]
    [--bubble-color:theme(colors.white)]
  `;

  return `${base} ${isSender ? senderStyle : receiverStyle}`;
};
