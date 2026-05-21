import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const CartContents = ({ cart, userId, guestId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleAddToCart = (productId, delta, quantity) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          userId,
        }),
      );
    }
  };

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
