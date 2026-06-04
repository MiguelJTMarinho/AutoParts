import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchWishlist,
  removeFromWishlist,
} from "../redux/slices/wishlistSlice";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

const WishlistPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.wishlist);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, userInfo]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
  };

  if (!userInfo) {
    return (
      <div className="container mx-auto py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("wishlist.title")}</h2>
        <p className="text-gray-500 mb-4">{t("wishlist.loginRequired")}</p>
        <Link
          to="/login"
          className="bg-main-blue text-white px-6 py-2 rounded-md hover:bg-blue-700"
        >
          {t("auth.login")}
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6">{t("wishlist.title")}</h2>

      {loading && (
        <p className="text-gray-500 animate-pulse">{t("wishlist.loading")}</p>
      )}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && items.length === 0 && (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">{t("wishlist.empty")}</p>
          <Link
            to="/products"
            className="mt-4 inline-block text-main-blue hover:underline"
          >
            {t("wishlist.continueShopping")}
          </Link>
        </div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="border p-4 rounded-lg flex flex-col bg-white shadow-sm relative group"
            >
              <div className="w-full mb-5">
                <button
                  onClick={() => handleRemove(item.product_id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-2"
                  title={t("wishlist.remove")}
                >
                  <FaTrash />
                </button>
              </div>
              <Link
                to={`/product/${item.product_id}`}
                className="grow flex flex-col"
              >
                <div className="bg-gray-100 aspect-square rounded-md flex items-center justify-center mb-4 overflow-hidden relative">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-gray-400">
                      {t("wishlist.viewProduct")}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-lg line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-gray-500 text-sm mb-2">
                  {t("wishlist.sku")}: {item.sku}
                </p>
                <p className="font-bold text-xl mt-auto">
                  {Number(item.price).toFixed(2)} €
                </p>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
