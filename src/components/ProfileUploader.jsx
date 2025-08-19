import React from "react";
import placeholder from "../assets/placeholder.png"; // Your default image

const ProfileUploader = ({ image, setImage }) => {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file); // send file to parent
    }
  };

  return (
    <label htmlFor="profileInput" className="cursor-pointer">
      <div className="h-24 w-24 sm:h-28 sm:w-28 md:h-32 md:w-32 rounded-full border-2 sm:border-3 md:border-4 border-white shadow-md overflow-hidden bg-gray-200">
        <img
          src={image ? URL.createObjectURL(image) : placeholder}
          alt="Profile Preview"
          className="object-cover w-full h-full"
        />
      </div>
      <input
        type="file"
        id="profileInput"
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />
    </label>
  );
};

export default ProfileUploader;