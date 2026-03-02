import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const newArrivals = [
    {
      _id: "1",
      name: "Farol BMW Série 3",
      price: 120,
      images: [
        {
          url: "https://picsum.photos/500/500?random=1",
          altText: "Farol BMW Série 3",
        },
      ],
    },
    {
      _id: "2",
      name: "Parachoques Audi A4",
      price: 180,
      images: [
        {
          url: "https://picsum.photos/500/500?random=2",
          altText: "Parachoques Audi A4",
        },
      ],
    },
    {
      _id: "3",
      name: "Espelho Retrovisor Mercedes C",
      price: 75,
      images: [
        {
          url: "https://picsum.photos/500/500?random=3",
          altText: "Espelho Retrovisor",
        },
      ],
    },
    {
      _id: "4",
      name: "Jante 18'' Volkswagen",
      price: 95,
      images: [
        {
          url: "https://picsum.photos/500/500?random=4",
          altText: "Jante 18",
        },
      ],
    },
    {
      _id: "5",
      name: "Radiador Peugeot 308",
      price: 140,
      images: [
        {
          url: "https://picsum.photos/500/500?random=5",
          altText: "Radiador",
        },
      ],
    },
    {
      _id: "6",
      name: "Capot Renault Megane",
      price: 200,
      images: [
        {
          url: "https://picsum.photos/500/500?random=6",
          altText: "Capot Megane",
        },
      ],
    },
    {
      _id: "7",
      name: "Turbo 1.6 HDI",
      price: 250,
      images: [
        {
          url: "https://picsum.photos/500/500?random=7",
          altText: "Turbo",
        },
      ],
    },
    {
      _id: "8",
      name: "Caixa de Velocidades Opel",
      price: 320,
      images: [
        {
          url: "https://picsum.photos/500/500?random=8",
          altText: "Caixa de velocidades",
        },
      ],
    },
  ];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const scroll = (direction) => {
    const scrollAmount = direction == "left" ? -300 : 300;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // Update Scroll Buttons
  const updateScrollButtons = () => {
    const container = scrollRef.current;

    if (container) {
      const leftScroll = container.scrollLeft;
      const rightScrollable =
        container.scrollWidth > leftScroll + container.clientWidth;

      setCanScrollLeft(leftScroll > 0);
      setCanScrollRight(rightScrollable);
    }

    console.log({
      scrollLeft: container.scrollLeft,
      ClientWidth: container.ClientWidth,
      containerScrollWidth: container.scrollWidth,
      offsetLeft: scrollRef.current.offsetLeft,
    });
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener("scroll", updateScrollButtons);
      updateScrollButtons();
      return () => container.removeEventListener("scroll", updateScrollButtons);
    }
  });

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
        <p className="text-lg text-gray-600 mb-13">
          Discover the latest auto parts added to our catalog. All components
          reliable, and ready for fast delivery.
        </p>

        {/* Scroll Buttons */}
        <div className="absolute right-0 -bottom-11.25 flex space-x-2 cursor-pointer">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`p-2 rounded border ${canScrollLeft ? "bg-white text-black cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            <FiChevronLeft className="text-2xl" />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 rounded border ${canScrollRight ? "bg-white text-black cursor-pointer" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
          >
            <FiChevronRight className="text-2xl" />
          </button>
        </div>
      </div>
      {/* Scrollable COntent */}
      <div
        ref={scrollRef}
        className={`container mx-auto overflow-x-scroll flex space-x-6 relative ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {newArrivals.map((product) => (
          <div
            key={product._id}
            className="min-w-full sm-min-w-[50%] lg:min-w-[30%] relative"
          >
            <img
              src={product.images[0]?.url}
              alt={product.images[0]?.altText || product.name}
              className="w-full h-125 object-cover rounded-lg"
              draggable="false"
            />
            <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white px-4 rounded-b-lg">
              <Link to={`/product/${product._id}`} className="block">
                <h4 className="font-medium">{product.name}</h4>
                <p className="mt-1">${product.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default NewArrivals;
