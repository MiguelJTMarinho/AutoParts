import { useEffect, useRef, useState, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";

const NewArrivals = () => {
  const { t } = useTranslation();
  const scrollRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/new_arrivals`,
        );
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      }
    };
    fetchNewArrivals();
  }, []);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    e.preventDefault();

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;

    if (Math.abs(walk) > 5) {
      setHasDragged(true);
    }

    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;

    el.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(
      Math.ceil(el.scrollLeft + el.clientWidth) < el.scrollWidth,
    );
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollButtons();
    el.addEventListener("scroll", updateScrollButtons);

    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [newArrivals, updateScrollButtons]);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold">{t("newArrivals.title")}</h2>
            <p className="text-gray-500">{t("newArrivals.subtitle")}</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className={`p-2 rounded-full border transition 
                ${canScrollLeft ? "bg-white hover:bg-gray-100" : "opacity-30 cursor-not-allowed"}`}
            >
              <FiChevronLeft />
            </button>

            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className={`p-2 rounded-full border transition 
                ${canScrollRight ? "bg-white hover:bg-gray-100" : "opacity-30 cursor-not-allowed"}`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>

        {/* SCROLLER */}
        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`flex gap-6 overflow-x-auto pb-4 
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}
            [&::-webkit-scrollbar]:hidden`}
        >
          {newArrivals.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              draggable="false"
              onDragStart={(e) => e.preventDefault()}
              onClick={(e) => {
                if (hasDragged) e.preventDefault();
              }}
              className="min-w-65 bg-white rounded-xl shadow-sm hover:shadow-lg transition group shrink-0 select-none"
            >
              {/* IMAGE */}
              <div className="h-64 overflow-hidden rounded-t-xl">
                <img
                  src={product.images[0]?.image_url}
                  alt={product.name}
                  draggable="false"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h4 className="font-medium text-gray-800 group-hover:text-black">
                  {product.name}
                </h4>

                <p className="mt-2 text-lg font-semibold text-blue-600">
                  €{product.price}
                </p>

                <div className="mt-3 text-sm text-gray-500">
                  {t("newArrivals.viewDetails")}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
