import React from "react";
import { useTranslation } from "react-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: t("privacy.sections.collect.title", "Information we collect"),
      content: t(
        "privacy.sections.collect.content",
        "We collect personal data that you provide directly when you create an account, place an order, or contact us. This includes name, email address, billing/shipping address, phone number, and payment-related information. We also collect technical data such as IP address, browser type, device information, and usage activity to ensure security and improve our services.",
      ),
    },
    {
      title: t("privacy.sections.legal.title", "Legal basis for processing"),
      content: t(
        "privacy.sections.legal.content",
        "We process your personal data under the following legal bases: (1) contract performance (order processing and account management), (2) legal obligation (tax and accounting requirements), (3) legitimate interest (fraud prevention, service improvement, analytics), and (4) consent (marketing communications and non-essential cookies).",
      ),
    },
    {
      title: t("privacy.sections.use.title", "How we use your information"),
      content: t(
        "privacy.sections.use.content",
        "Your data is used to process orders, manage your account, provide customer support, send transactional emails, improve our website, prevent fraud, and comply with legal obligations. If you consent, we may also send marketing communications about products or promotions.",
      ),
    },
    {
      title: t("privacy.sections.share.title", "Sharing your information"),
      content: t(
        "privacy.sections.share.content",
        "We do not sell your personal data. We only share information with trusted third parties necessary to operate our business, including payment processors, shipping companies, hosting providers, and analytics services. All partners are contractually bound to protect your data under GDPR.",
      ),
    },
    {
      title: t(
        "privacy.sections.transfer.title",
        "International data transfers",
      ),
      content: t(
        "privacy.sections.transfer.content",
        "Some service providers may process data outside the European Economic Area (EEA). In such cases, we ensure appropriate safeguards such as Standard Contractual Clauses (SCCs) approved by the European Commission to guarantee adequate data protection.",
      ),
    },
    {
      title: t("privacy.sections.cookies.title", "Cookies and tracking"),
      content: t(
        "privacy.sections.cookies.content",
        "We use essential cookies for website functionality, analytics cookies to understand usage, and optional marketing cookies. Non-essential cookies are only activated with your consent through our cookie banner. You may withdraw consent or modify preferences at any time.",
      ),
    },
    {
      title: t("privacy.sections.retention.title", "Data retention"),
      content: t(
        "privacy.sections.retention.content",
        "We retain personal data only for as long as necessary: order and billing data for up to 10 years (legal tax requirements), account data until deletion request, and analytics data typically for up to 26 months. After these periods, data is securely deleted or anonymised.",
      ),
    },
    {
      title: t("privacy.sections.security.title", "Data security"),
      content: t(
        "privacy.sections.security.content",
        "We implement technical and organisational measures to protect your data, including encryption in transit (HTTPS), secure authentication systems, access control, and monitoring. Payment data is processed securely by certified payment providers and is never stored on our servers.",
      ),
    },
    {
      title: t("privacy.sections.rights.title", "Your rights under GDPR"),
      content: t(
        "privacy.sections.rights.content",
        "You have the right to access, rectify, erase, restrict or object to processing of your data, as well as the right to data portability and withdrawal of consent at any time. You may also lodge a complaint with the Portuguese Data Protection Authority (CNPD). To exercise your rights, contact us at support@autoparts.com.",
      ),
    },
    {
      title: t("privacy.sections.children.title", "Children’s privacy"),
      content: t(
        "privacy.sections.children.content",
        "Our services are not intended for individuals under 16 years old. We do not knowingly collect personal data from minors. If we become aware that such data has been collected, it will be deleted immediately.",
      ),
    },
    {
      title: t("privacy.sections.changes.title", "Changes to this policy"),
      content: t(
        "privacy.sections.changes.content",
        "We may update this Privacy Policy from time to time. Significant changes will be communicated on our website or via email when appropriate. The latest version will always be available on this page.",
      ),
    },
  ];

  return (
    <div className="container mx-auto py-12 px-4 lg:px-0">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-main-blue text-white p-10 md:p-16 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("privacy.hero.title", "Privacy Policy")}
          </h1>

          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            {t(
              "privacy.hero.subtitle",
              "This policy explains how we collect, use and protect your personal data in accordance with GDPR.",
            )}
          </p>

          <p className="text-sm opacity-70 mt-4">
            {t("privacy.hero.lastUpdated", "Last updated")}: June 2026
          </p>
        </div>

        {/* Controller Info (IMPORTANT GDPR ADDITION) */}
        <div className="p-10 md:p-16 border-b border-gray-100 text-sm text-gray-600">
          <p className="font-semibold text-gray-800 mb-2">Data Controller</p>
          <p>
            AutoParts (Legal Entity Name Here)
            <br />
            Address: Rua da Tecnologia, 123, Porto, Portugal
            <br />
            Email: support@autoparts.com
          </p>
        </div>

        {/* Intro */}
        <div className="p-10 md:p-16 border-b border-gray-100">
          <p className="text-gray-600 leading-relaxed">
            {t(
              "privacy.intro",
              "We are committed to protecting your personal data and respecting your privacy rights under the General Data Protection Regulation (GDPR).",
            )}
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

        {/* Contact + CNPD */}
        <div className="bg-gray-50 p-10 md:p-16 border-t border-gray-100 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Questions about your data?
          </h2>

          <p className="text-gray-600 text-sm mb-4">
            Contact us at support@autoparts.com or file a complaint with CNPD
            (Portugal Data Protection Authority).
          </p>

          <a
            href="mailto:support@autoparts.com"
            className="inline-block bg-main-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
