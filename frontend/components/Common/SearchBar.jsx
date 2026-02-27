import React, { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search Term:", searchTerm);
  };

  return (
    <form onSubmit={handleSearch} className="w-full md:max-w-[50%] relative">
      <input
        type="text"
        placeholder="Search parts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-700 bg-gray-50 rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-main-blue placeholder:text-gray-700"
      />
      {/*Search Icon */}
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 cursor-pointer"
      >
        <HiMagnifyingGlass className="h-6 w-6" />
      </button>
    </form>
  );
};

export default SearchBar;
