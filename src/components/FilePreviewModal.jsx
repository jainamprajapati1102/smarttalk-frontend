// import React, { useState, useEffect, useMemo } from "react";
// import { HiX } from "react-icons/hi";

// const FilePreviewModal = ({ file, onClose, onSend, isOpen }) => {
//   const [caption, setCaption] = useState("");
//   const [zoomed, setZoomed] = useState(false);
//   const [isSending, setIsSending] = useState(false);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.key === "Escape") onClose();
//     };
//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [onClose]);

//   const fileURL = useMemo(() => file && URL.createObjectURL(file), [file]);

//   const mime = file?.type || "";
//   const fileType = useMemo(() => {
//     if (mime.startsWith("image/")) return "image";
//     if (mime.startsWith("video/")) return "video";
//     if (mime.startsWith("audio/")) return "audio";
//     return "document";
//   }, [mime]);

//   if (!isOpen || !file) return null;

//   const handleSend = async () => {
//     setIsSending(true);
//     await onSend({ file, caption, fileType });
//     setIsSending(false);
//     setCaption("");
//     onClose();
//   };

//   const renderPreview = () => {
//     switch (fileType) {
//       case "image":
//         return (
//           <img
//             src={fileURL}
//             alt="Preview"
//             onClick={() => setZoomed(!zoomed)}
//             className={`rounded-md cursor-pointer transition-transform duration-300 object-contain w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px] ${
//               zoomed ? "scale-150" : ""
//             }`}
//           />
//         );
//       case "video":
//         return (
//           <video
//             src={fileURL}
//             controls
//             className="rounded-md object-contain w-full max-h-[200px] sm:max-h-[250px] md:max-h-[300px]"
//           />
//         );
//       case "audio":
//         return (
//           <audio
//             src={fileURL}
//             controls
//             className="w-full rounded-md"
//           />
//         );
//       default:
//         return (
//           <div className="flex flex-col items-center text-gray-600">
//             <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gray-200 rounded-md flex items-center justify-center text-2xl sm:text-3xl">
//               📄
//             </div>
//             <span className="text-xs sm:text-sm mt-1 text-gray-500 text-center truncate max-w-full">
//               {file.name} • {(file.size / 1024).toFixed(1)} kB
//             </span>
//           </div>
//         );
//     }
//   };

//   return (
//     <div className="fixed inset-0 z-50">
//       {/* Overlay */}
//       <div
//         className="absolute inset-0 bg-opacity-40 backdrop-blur-sm"
//         onClick={onClose}
//       />

//       {/* Modal Content */}
//       <div className="relative z-10 flex items-center justify-center min-h-screen px-2 sm:px-4">
//         <div className="bg-white border rounded-lg shadow-xl p-3 sm:p-4 w-full max-w-[90vw] sm:max-w-lg">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-2 sm:mb-3">
//             <p className="text-xs sm:text-sm font-medium text-gray-700 truncate max-w-[70%] sm:max-w-[80%]">
//               {file.name}
//             </p>
//             <button
//               className="text-gray-500 hover:text-red-500"
//               onClick={onClose}
//             >
//               <HiX size={16} className="sm:size-8" />
//             </button>
//           </div>

//           {/* Preview */}
//           <div className="flex justify-center mb-2 sm:mb-3 overflow-hidden">
//             {renderPreview()}
//           </div>

//           {/* Caption Input & Send */}
//           <div className="flex items-center gap-1 sm:gap-2 mt-2">
//             <input
//               type="text"
//               placeholder="Add a caption"
//               className="flex-grow border border-gray-300 rounded px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={caption}
//               onChange={(e) => setCaption(e.target.value)}
//             />
//             <button
//               onClick={handleSend}
//               disabled={isSending}
//               className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-medium text-white ${
//                 isSending
//                   ? "bg-green-400 cursor-wait"
//                   : "bg-green-600 hover:bg-green-700"
//               }`}
//             >
//               {isSending ? "Sending..." : "Send"}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FilePreviewModal;
import React, { useState, useEffect, useMemo } from "react";
import { HiX } from "react-icons/hi";

const FilePreviewModal = ({ file, onClose, onSend, isOpen }) => {
  const [caption, setCaption] = useState("");
  const [zoomed, setZoomed] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const fileURL = useMemo(() => file && URL.createObjectURL(file), [file]);

  const fileType = useMemo(() => {
    const mime = file?.type || "";
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    return "document";
  }, [file]);

  const handleSend = async () => {
    setIsSending(true);
    await onSend({ file, caption, fileType });
    setIsSending(false);
    setCaption("");
    onClose();
  };

  if (!isOpen || !file) return null;

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return (
          <img
            src={fileURL}
            alt="Preview"
            onClick={() => setZoomed(!zoomed)}
            className={`object-contain rounded-lg cursor-zoom-in transition-transform duration-300 w-full max-h-[300px] ${
              zoomed ? "scale-150" : ""
            }`}
          />
        );
      case "video":
        return (
          <video
            src={fileURL}
            controls
            className="object-contain rounded-lg w-full max-h-[300px]"
          />
        );
      case "audio":
        return <audio src={fileURL} controls className="w-full rounded-md" />;
      default:
        return (
          <div className="flex flex-col items-center text-gray-600">
            <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-3xl">
              📄
            </div>
            <span className="mt-1 text-sm text-gray-500 text-center truncate max-w-full">
              {file.name} • {(file.size / 1024).toFixed(1)} kB
            </span>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white rounded-xl shadow-2xl p-4 w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <p className="truncate text-sm font-semibold text-gray-800 max-w-[80%]">
              {file.name}
            </p>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 transition"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>

          {/* Preview */}
          <div className="flex justify-center items-center mb-4 overflow-hidden max-h-[300px]">
            {renderPreview()}
          </div>

          {/* Caption & Send */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add a caption..."
              className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={isSending}
              className={`px-4 py-2 text-sm font-semibold rounded text-white transition ${
                isSending
                  ? "bg-green-400 cursor-wait"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;
