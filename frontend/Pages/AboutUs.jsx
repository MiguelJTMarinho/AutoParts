import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiCheck } from "react-icons/hi";
import { HiShoppingBag, HiOutlineCreditCard } from "react-icons/hi";
import { HiMiniCheckCircle } from "react-icons/hi2";

const AboutUs = () => {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto py-12 px-4 lg:px-0">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header / Hero */}
        <div className="bg-main-blue text-white p-10 md:p-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("aboutUs.hero.title")}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {t("aboutUs.hero.subtitle")}
          </p>
        </div>

        {/* Story & Stats */}
        <div className="p-10 md:p-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-main-blue font-semibold mb-2">
              {t("aboutUs.story.subtitle")}
            </h2>
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              {t("aboutUs.story.title")}
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {t("aboutUs.story.p1")}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {t("aboutUs.story.p2")}
            </p>
            <Link
              to="/products"
              className="inline-block bg-main-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              {t("aboutUs.story.cta")}
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: "10+",
                label: t("aboutUs.stats.years"),
              },
              {
                value: "1K+",
                label: t("aboutUs.stats.parts"),
              },
              {
                value: "20K+",
                label: t("aboutUs.stats.customers"),
              },
              {
                value: "99%",
                label: t("aboutUs.stats.satisfaction"),
              },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-gray-50 rounded-xl p-6 text-center border border-gray-100"
              >
                <p className="text-3xl font-black text-main-blue mb-2">
                  {value}
                </p>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-gray-50 p-10 md:p-16 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4 bg-white shadow-sm text-main-blue">
                <HiShoppingBag className="text-3xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("aboutUs.values.quality.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("aboutUs.values.quality.description")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4 bg-white shadow-sm text-main-blue">
                <HiMiniCheckCircle className="text-3xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("aboutUs.values.trust.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("aboutUs.values.trust.description")}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4 bg-white shadow-sm text-main-blue">
                <HiOutlineCreditCard className="text-3xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                {t("aboutUs.values.value.title")}
              </h4>
              <p className="text-gray-600 text-sm">
                {t("aboutUs.values.value.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Why Us & CTA */}
        <div className="p-10 md:p-16 border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Why Us */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
                {t("aboutUs.whyUs.title")}
              </h2>
              <h3 className="text-main-blue font-medium mb-6">
                {t("aboutUs.whyUs.subtitle")}
              </h3>
              <ul className="space-y-4 text-gray-600">
                {[
                  t("aboutUs.whyUs.catalogue"),
                  t("aboutUs.whyUs.shipping"),
                  t("aboutUs.whyUs.support"),
                  t("aboutUs.whyUs.returns"),
                  t("aboutUs.whyUs.payment"),
                ].map((reason) => (
                  <li key={reason} className="flex items-start gap-3">
                    <HiCheck className="text-main-blue shrink-0 text-xl mt-0.5" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-main-blue/5 rounded-xl p-8 border border-main-blue/10 flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">
                {t("aboutUs.cta.title")}
              </h2>
              <p className="text-main-blue mb-6 font-medium">
                {t("aboutUs.cta.subtitle")}
              </p>

              <ul className="space-y-4 text-gray-600 mb-8">
                {[
                  t("aboutUs.cta.search"),
                  t("aboutUs.cta.compat"),
                  t("aboutUs.cta.order"),
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <HiCheck className="text-main-blue shrink-0 text-xl mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-main-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors text-center"
                >
                  {t("aboutUs.cta.shop")}
                </Link>
                <Link
                  to="/contact"
                  className="border border-main-blue text-main-blue px-6 py-3 rounded-md font-medium hover:bg-main-blue hover:text-white transition-colors text-center"
                >
                  {t("aboutUs.cta.contact")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
