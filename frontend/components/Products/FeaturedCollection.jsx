import React from "react";
import { Link } from "react-router-dom";
import featured from "../../src/assets/featured.png";
import { useTranslation } from "react-i18next";

const FeaturedCollection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center bg-main-blue/15 rounded-3xl">
        {/* Left Content */}
        <div className="lg:w-1/2 p-8 text-center lg:text-left">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            {t("featuredCollection.subtitle")}
          </h2>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            {t("featuredCollection.title")}
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            {t("featuredCollection.description")}
          </p>
          <Link
            to="/products"
            className="bg-black text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-800"
          >
            {t("featuredCollection.shopNow")}
          </Link>
        </div>
        {/* Right Content */}
        <div className="lg:w-1/2">
          <img
            src={featured}
            alt="Featured Auto Parts"
            className="w-full h-full object-cover lg:rounded-tr-3xl lg:rounded-br-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
