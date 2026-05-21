import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";

const CartContents = () => {
  const { t } = useTranslation();

  const cartProducts = [
    {
      product: 1,
      name: "RIDEX 854S0720 Amortecedor para FORD FOCUS, C-MAX",
      category: "Suspension",
      make: "Ford",
      model: "Focus",
      quantity: "1",
      price: "50",
      image: "https://picsum.photos/200?random=1",
    },
    {
      product: 2,
      name: "Amortecedor para FORD Fiesta, C-MAX",
      category: "Suspension",
      make: "Ford",
      model: "Fiesta",
      quantity: "1",
      price: "45",
      image: "https://picsum.photos/200?random=2",
    },
  ];
  return (
    <div>
      {cartProducts.map((product, index) => (
        <div
          key={index}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                {t("cartContents.category")}: {product.category} |{" "}
                {t("cartContents.car")}: {product.make} {product.model}
              </p>
              <div className="flex items-center mt-2">
                <button className="border rounded px-2 py-1 text-xl font-medium cursor-pointer">
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button className="border rounded px-2 py-1 text-xl font-medium cursor-pointer">
                  +
                </button>
              </div>
            </div>
          </div>
          <div>
            <p>{product.price.toLocaleString()}€</p>
            <button>
              <RiDeleteBin3Line className="h-6 w-6 text-red-600 cursor-pointer" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
