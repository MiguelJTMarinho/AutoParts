import React, { useState, useEffect } from "react";

const selectedProduct = {
  name: "Farol BMW Série 3",
  price: 120,
  description: "Original used headlight in excellent condition.",
  brand: "BMW",
  model: "Série 3",
  year: "2010-2014",
  condition: "Used",
  images: [
    { url: "https://picsum.photos/600/600?1" },
    { url: "https://picsum.photos/600/600?2" },
    { url: "https://picsum.photos/600/600?3" },
  ],
};

const ProductDetails = () => {
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleQuantityChange = (action) => {
    if (action === "plus") setQuantity((prev) => prev + 1);
    if (action === "minus" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  useEffect(() => {
    setMainImage(selectedProduct.images[0].url);
  }, []);

  return (
    <div className="py-10">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* LEFT SIDE */}
          <div className="flex gap-4">
            {/* thumbnails */}
            <div className="hidden md:flex flex-col gap-3">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  onClick={() => setMainImage(image.url)}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-400"}`}
                />
              ))}
            </div>

            {/* main image */}
            <div className="flex-1">
              <img src={mainImage} className="w-full rounded-lg border" />

              {/* mobile thumbs */}
              <div className="flex md:hidden gap-2 mt-3 overflow-x-auto">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    onClick={() => setMainImage(image.url)}
                    className={`w-16 h-16 object-cover rounded-lg cursor-pointer border ${mainImage === image.url ? "border-black" : "border-gray-400"}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <h1 className="text-3xl font-semibold mb-2">
              {selectedProduct.name}
            </h1>

            <p className="text-2xl text-main-blue font-bold mb-4">
              ${selectedProduct.price}
            </p>

            <p className="text-gray-600 mb-6">{selectedProduct.description}</p>

            {/* quantity */}
            <div className="mb-6">
              <p className="mb-2 font-medium">Quantity</p>

              <div className="flex gap-3">
                <button
                  onClick={() => handleQuantityChange("minus")}
                  className={`px-3 py-1 bg-gray-200 rounded ${quantity === 1 ? "cursor-default" : "cursor-pointer"}`}
                >
                  -
                </button>

                <span className="px-4 py-1 border rounded">{quantity}</span>

                <button
                  onClick={() => handleQuantityChange("plus")}
                  className="px-3 py-1 bg-gray-200 rounded cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* add to cart */}
            <button className="w-full bg-main-blue text-white py-3 rounded font-semibold hover:opacity-90 cursor-pointer">
              Add to cart
            </button>

            {/* characteristics */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">Characteristics</h3>

              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="py-2 text-gray-500">Brand</td>
                    <td>{selectedProduct.brand}</td>
                  </tr>

                  <tr>
                    <td className="py-2 text-gray-500">Model</td>
                    <td>{selectedProduct.model}</td>
                  </tr>

                  <tr>
                    <td className="py-2 text-gray-500">Year</td>
                    <td>{selectedProduct.year}</td>
                  </tr>

                  <tr>
                    <td className="py-2 text-gray-500">Condition</td>
                    <td>{selectedProduct.condition}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
