import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { HiOutlineSquares2X2 } from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const CategoryMenu = () => {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeParent, setActiveParent] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((res) => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setActiveParent(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const parents = categories.filter((c) => !c.parent_id && !c.parentId);
  const childrenOf = (id) =>
    categories.filter((c) => String(c.parent_id || c.parentId) === String(id));

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          setActiveParent(null);
        }}
        className="flex items-center gap-2 hover:text-main-blue transition cursor-pointer"
      >
        <HiOutlineSquares2X2 className="h-6 w-6 text-gray-700" />
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 bg-white border rounded-lg shadow-xl flex min-w-[520px]">
          {/* Parent list */}
          <ul className="w-48 border-r py-2">
            {parents.map((parent) => (
              <li key={parent.id}>
                <button
                  onMouseEnter={() => setActiveParent(parent.id)}
                  onClick={() => setActiveParent(parent.id)}
                  className={`w-full text-left px-4 py-2 text-sm flex justify-between items-center hover:bg-gray-50 hover:text-main-blue transition ${
                    activeParent === parent.id
                      ? "text-main-blue bg-gray-50"
                      : ""
                  }`}
                >
                  {parent.name}
                  {childrenOf(parent.id).length > 0 && (
                    <span className="text-gray-400">›</span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Children list */}
          <div className="flex-1 py-2">
            {activeParent ? (
              <>
                <Link
                  to={`/products?parentCategory=${activeParent}_${parents.find((p) => p.id === activeParent)?.name}`}
                  onClick={() => {
                    setOpen(false);
                    setActiveParent(null);
                  }}
                  className="block px-4 py-2 text-xs text-gray-400 uppercase hover:text-main-blue hover:bg-gray-50 transition"
                >
                  {t("categoryMenu.viewAll", "Ver tudo")}
                </Link>
                {childrenOf(activeParent).map((child) => (
                  <Link
                    key={child.id}
                    to={`/products?parentCategory=${activeParent}_${parents.find((p) => p.id === activeParent)?.name}&category=${child.id}_${child.name}`}
                    onClick={() => {
                      setOpen(false);
                      setActiveParent(null);
                    }}
                    className="block px-4 py-2 text-sm hover:bg-gray-50 hover:text-main-blue transition"
                  >
                    {child.name}
                  </Link>
                ))}
              </>
            ) : (
              <p className="px-4 py-2 text-sm text-gray-400">
                {t("categoryMenu.hoverPrompt", "Passe o rato numa categoria")}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
