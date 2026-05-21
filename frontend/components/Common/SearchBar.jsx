import React, { useEffect, useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SearchBar = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Sincroniza o input apenas se já estivermos na página de produtos
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();

    // Criamos os parâmetros do zero para a página de produtos
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
      navigate(`/products?${params.toString()}`);
    } else {
      // Se pesquisar em branco, apenas vai para a página de produtos limpa
      navigate("/products");
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full md:max-w-[50%] relative">
      <input
        type="text"
        placeholder={t("searchBar.placeholder")}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-700 rounded-md pl-3 pr-10 py-2 focus:outline-none focus:ring-1 focus:ring-main-blue placeholder:text-gray-700"
      />
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
