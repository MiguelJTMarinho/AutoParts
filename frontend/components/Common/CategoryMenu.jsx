import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  HiOutlineSquares2X2,
  HiChevronRight,
  HiChevronDown,
  HiXMark,
} from "react-icons/hi2";
import { useTranslation } from "react-i18next";

const CategoryMenu = () => {
  const { t } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeParent, setActiveParent] = useState(null);
  const [mobileParent, setMobileParent] = useState(null);

  const ref = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/categories`)
      .then((res) => setCategories(res.data || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        window.innerWidth >= 768 &&
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setOpen(false);
        setActiveParent(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setOpen(false);
    setActiveParent(null);
    setMobileParent(null);
  };

  const parents = categories.filter((c) => !c.parent_id && !c.parentId);

  const childrenOf = (id) =>
    categories.filter((c) => String(c.parent_id || c.parentId) === String(id));

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => {
          setOpen((prev) => !prev);
          setActiveParent(null);
        }}
        className="flex items-center justify-center hover:bg-gray-200 transition cursor-pointer rounded-lg"
      >
        <HiOutlineSquares2X2 className="h-6 w-6 text-gray-700" />
      </button>

      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMenu}
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-50
          shadow-2xl transform transition-transform duration-300
          md:hidden
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <h3 className="font-semibold text-lg">
            {t("categories", "Categorias")}
          </h3>

          <button onClick={closeMenu}>
            <HiXMark className="h-6 w-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-73px)]">
          {parents.map((parent) => {
            const children = childrenOf(parent.id);

            return (
              <div key={parent.id} className="border-b border-gray-100">
                <button
                  onClick={() =>
                    setMobileParent(
                      mobileParent === parent.id ? null : parent.id,
                    )
                  }
                  className={`w-full px-4 py-4 flex items-center justify-between transition ${
                    mobileParent === parent.id
                      ? "bg-blue-50 text-main-blue"
                      : ""
                  }`}
                >
                  <span>{parent.name}</span>

                  {children.length > 0 &&
                    (mobileParent === parent.id ? (
                      <HiChevronDown />
                    ) : (
                      <HiChevronRight />
                    ))}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    mobileParent === parent.id ? "max-h-125" : "max-h-0"
                  }`}
                >
                  <Link
                    to={`/products?parentCategory=${parent.id}_${parent.name}`}
                    onClick={closeMenu}
                    className="block px-8 py-3 font-medium text-main-blue bg-gray-50"
                  >
                    {t("categoryMenu.viewAll", "Ver tudo")}
                  </Link>

                  {children.map((child) => (
                    <Link
                      key={child.id}
                      to={`/products?parentCategory=${parent.id}_${parent.name}&category=${child.id}_${child.name}`}
                      onClick={closeMenu}
                      className="block px-8 py-3 text-sm text-gray-600 hover:text-main-blue"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DESKTOP MEGA MENU */}
      {open && (
        <div className="hidden md:flex absolute top-full left-0 z-50 mt-2 bg-white border rounded-xl shadow-2xl min-w-[650px] overflow-hidden">
          {/* Parents */}
          <ul className="w-56 border-r py-2 bg-gray-50">
            {parents.map((parent) => (
              <li key={parent.id}>
                <button
                  onMouseEnter={() => setActiveParent(parent.id)}
                  onClick={() => setActiveParent(parent.id)}
                  className={`w-full text-left px-4 py-3 flex items-center justify-between text-sm transition ${
                    activeParent === parent.id
                      ? "bg-white text-main-blue font-medium"
                      : "hover:bg-white hover:text-main-blue"
                  }`}
                >
                  <span>{parent.name}</span>

                  {childrenOf(parent.id).length > 0 && (
                    <HiChevronRight className="text-gray-400" />
                  )}
                </button>
              </li>
            ))}
          </ul>

          {/* Children */}
          <div className="flex-1 min-h-[320px] p-4">
            {activeParent ? (
              <>
                <Link
                  to={`/products?parentCategory=${activeParent}_${parents.find((p) => p.id === activeParent)?.name}`}
                  onClick={closeMenu}
                  className="inline-block mb-4 text-sm font-semibold text-main-blue"
                >
                  {t("categoryMenu.viewAll", "Ver tudo")}
                </Link>

                <div className="grid grid-cols-2 gap-2">
                  {childrenOf(activeParent).map((child) => (
                    <Link
                      key={child.id}
                      to={`/products?parentCategory=${activeParent}_${parents.find((p) => p.id === activeParent)?.name}&category=${child.id}_${child.name}`}
                      onClick={closeMenu}
                      className="px-3 py-2 rounded-lg text-sm hover:bg-gray-50 hover:text-main-blue transition"
                    >
                      {child.name}
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                {t("categoryMenu.hoverPrompt", "Passe o rato numa categoria")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
