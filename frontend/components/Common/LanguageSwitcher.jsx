import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex space-x-2 text-sm font-medium text-gray-700">
      <button
        onClick={() => changeLanguage("pt")}
        className={`cursor-pointer hover:text-main-blue ${i18n.language === "pt" ? "font-bold text-main-blue" : ""}`}
      >
        PT
      </button>
      <span>|</span>
      <button
        onClick={() => changeLanguage("en")}
        className={`cursor-pointer hover:text-main-blue ${i18n.language === "en" ? "font-bold text-main-blue" : ""}`}
      >
        EN
      </button>
      <span>|</span>
      <button
        onClick={() => changeLanguage("es")}
        className={`cursor-pointer hover:text-main-blue ${i18n.language === "es" ? "font-bold text-main-blue" : ""}`}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
