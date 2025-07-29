// import React, { useState } from "react";
// import { HiX } from "react-icons/hi";

// const FilePreviewBox = ({ file, fileType, onClose, onSend }) => {
//   const [caption, setCaption] = useState("");
//   const fileURL = URL.createObjectURL(file);

//   const handleSend = () => {
//     onSend({ file, caption });
//     setCaption("");
//     onClose();
//   };

//   const renderPreview = () => {
//     if (fileType === "image") {
//       return (
//         <img
//           src={fileURL}
//           alt="Preview"
//           className="max-h-52 object-contain rounded-md"
//         />
//       );
//     }

//     return (
//       <div className="flex flex-col items-center text-gray-600">
//         <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-xl">
//           📄
//         </div>
//         <span className="text-sm mt-1 text-gray-500">
//           {file.name} • {(file.size / 1024).toFixed(1)} kB
//         </span>
//       </div>
//     );
//   };

//   return (
//     <div className="bg-white border rounded-md p-3 shadow-md flex flex-col gap-3 mb-2">
//       {/* Close button */}
//       <div className="flex justify-between items-center">
//         <p className="text-sm font-medium text-gray-700 truncate w-full">{file.name}</p>
//         <button
//           className="text-gray-500 hover:text-red-500"
//           onClick={onClose}
//         >
//           <HiX size={20} />
//         </button>
//       </div>

//       {/* Preview */}
//       <div className="flex justify-center">{renderPreview()}</div>

//       {/* Caption & Send */}
//       <div className="flex items-center gap-2 mt-2">
//         <input
//           type="text"
//           placeholder="Add a caption"
//           className="flex-grow border rounded px-3 py-2 text-sm"
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//         />
//         <button
//           onClick={handleSend}
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FilePreviewBox;


import React, { useState } from "react";
import { HiX } from "react-icons/hi";

const FilePreviewModal = ({ file, fileType, onClose, onSend, isOpen }) => {
  const [caption, setCaption] = useState("");
  const fileURL = file ? URL.createObjectURL(file) : null;

  if (!isOpen || !file) return null;

  const handleSend = () => {
    onSend({ file, caption, fileType });
    setCaption("");
    onClose();
  };

  const renderPreview = () => {
    if (fileType === "image") {
      return (
        <img
          src={fileURL}
          alt="Preview"
          className="max-h-64 object-contain rounded-md"
        />
      );
    } else if (fileType === "video") {
      return (
        <video
          src={fileURL}
          controls
          className="max-h-64 object-contain rounded-md"
        />
      );
    } else if (fileType === "audio") {
      return (
        <audio
          src={fileURL}
          controls
          className="w-full max-h-64 rounded-md"
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center text-gray-600">
          <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-xl">
            📄
          </div>
          <span className="text-sm mt-1 text-gray-500">
            {file.name} • {(file.size / 1024).toFixed(1)} kB
          </span>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white border rounded-lg shadow-lg p-4 max-w-md w-full mx-4">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-gray-700 truncate w-full">
            {file.name}
          </p>
          <button
            className="text-gray-500 hover:text-red-500"
            onClick={onClose}
          >
            <HiX size={20} />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex justify-center mb-3">{renderPreview()}</div>

        {/* Caption & Send */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Add a caption"
            className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
          <button
            onClick={handleSend}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;