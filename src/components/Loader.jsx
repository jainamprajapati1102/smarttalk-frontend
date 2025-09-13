import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      <p className="mt-3 text-sm text-gray-600">{text}</p>
    </div>
  );
};

export default Loader;
