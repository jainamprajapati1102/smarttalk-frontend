import React, { useState, useEffect, useMemo } from "react";
import { HiX } from "react-icons/hi";

const FilePreviewModal = ({ file, onClose, onSend, isOpen }) => {
  const [caption, setCaption] = useState("");
  const [zoomed, setZoomed] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // 🔄 Hooks must be before any conditional return
  const fileURL = useMemo(() => file && URL.createObjectURL(file), [file]);

  const mime = file?.type || "";
  const fileType = useMemo(() => {
    if (mime.startsWith("image/")) return "image";
    if (mime.startsWith("video/")) return "video";
    if (mime.startsWith("audio/")) return "audio";
    return "document";
  }, [mime]);

  // ❌ Don't place hooks after return
  if (!isOpen || !file) return null;

  const handleSend = async () => {
    setIsSending(true);
    await onSend({ file, caption, fileType });
    setIsSending(false);
    setCaption("");
    onClose();
  };

  const renderPreview = () => {
    switch (fileType) {
      case "image":
        return (
          <img
            src={fileURL}
            alt="Preview"
            onClick={() => setZoomed(!zoomed)}
            className={`rounded-md cursor-pointer transition-transform duration-300 object-contain ${
              zoomed ? "scale-150" : "max-h-64"
            }`}
          />
        );
      case "video":
        return (
          <video
            src={fileURL}
            controls
            className="max-h-64 rounded-md object-contain"
          />
        );
      case "audio":
        return <audio src={fileURL} controls className="w-full rounded-md" />;
      default:
        return (
          <div className="flex flex-col items-center text-gray-600">
            <div className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center text-3xl">
              📄
            </div>
            <span className="text-sm mt-1 text-gray-500 text-center">
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
        className="absolute inset-0  bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="bg-white border rounded-lg shadow-xl p-4 w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-medium text-gray-700 truncate">
              {file.name}
            </p>
            <button
              className="text-gray-500 hover:text-red-500"
              onClick={onClose}
            >
              <HiX size={20} />
            </button>
          </div>

          {/* Preview */}
          <div className="flex justify-center mb-3 overflow-hidden">
            {renderPreview()}
          </div>

          {/* Caption Input & Send */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              placeholder="Add a caption"
              className="flex-grow border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={isSending}
              className={`px-4 py-2 rounded text-sm font-medium text-white ${
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
