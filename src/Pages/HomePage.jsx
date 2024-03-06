import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const LoginPage = () => {
  const [tag, setTag] = useState("");

  const handleTagChange = (e) => {
    setTag(e.target.value);
  };

  const handleStartChat = () => {
    // Add logic here to handle login or validation
    // For now, just console log the tag
    console.log("Tag:", tag);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <div className="mb-4">
        <label
          htmlFor="tag"
          className="block text-sm font-medium text-gray-700"
        >
          Tag
        </label>
        <input
          type="text"
          id="tag"
          value={tag}
          onChange={handleTagChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <div className="flex justify-center">
        <NavLink
          to={`/chat?tag=${tag}`}
          onClick={handleStartChat}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none"
        >
          Start
        </NavLink>
      </div>
    </div>
  );
};

export default LoginPage;
