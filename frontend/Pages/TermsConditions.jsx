import React from "react";
import { useTranslation } from "react-i18next";

const TermsAndConditions = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("terms.intro.title"),
      content: t("terms.intro.content"),
    },
    {
      title: t("terms.company.title"),
      content: t("terms.company.content"),
    },
    {
      title: t("terms.orders.title"),
      content: t("terms.orders.content"),
    },
    {
      title: t("terms.pricing.title"),
      content: t("terms.pricing.content"),
    },
    {
      title: t("terms.shipping.title"),
      content: t("terms.shipping.content"),
    },
    {
      title: t("terms.returns.title"),
      content: t("terms.returns.content"),
    },
    {
      title: t("terms.warranties.title"),
      content: t("terms.warranties.content"),
    },
    {
      title: t("terms.liability.title"),
      content: t("terms.liability.content"),
    },
    {
      title: t("terms.user.title"),
      content: t("terms.user.content"),
    },
    {
      title: t("terms.intellectual.title"),
      content: t("terms.intellectual.content"),
    },
    {
      title: t("terms.privacy.title"),
      content: t("terms.privacy.content"),
    },
    {
      title: t("terms.changes.title"),
      content: t("terms.changes.content"),
    },
    {
      title: t("terms.governing.title"),
      content: t("terms.governing.content"),
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 lg:px-0">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-main-blue text-white p-10 md:p-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("terms.hero.title")}
          </h1>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {t("terms.hero.subtitle")}
          </p>
          <p className="text-sm opacity-70 mt-4">
            {t("terms.hero.lastUpdated")}: June 2026
          </p>
        </div>

        {/* Sections */}
        <div className="divide-y divide-gray-100">
          {sections.map(({ title, content }, index) => (
            <div key={title} className="p-10 md:px-16 md:py-12">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <span className="text-xs font-semibold text-main-blue uppercase tracking-wider">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="text-lg font-bold text-gray-800 mt-1">
                    {title}
                  </h2>
                </div>
                <div className="lg:col-span-3">
                  <p className="text-gray-600 leading-relaxed">{content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-10 md:p-16 border-t border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {t("terms.footer.title")}
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            {t("terms.footer.subtitle")}
          </p>

          <a
            href="mailto:support@autoparts.com"
            className="inline-block bg-main-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            {t("terms.footer.contact")}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
