import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FiPhoneCall, FiMail, FiMapPin } from "react-icons/fi";
import { toast } from "sonner";

const ContactUs = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(
        t(
          "contactUs.successMessage",
          "Message sent successfully! We will get back to you soon.",
        ),
      );
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <div className="container mx-auto py-12 px-4 lg:px-0">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Contact Information */}
          <div className="bg-main-blue text-white p-10">
            <h2 className="text-3xl font-bold mb-6">
              {t("contactUs.title", "Contact Us")}
            </h2>
            <p className="mb-8 opacity-90">
              {t(
                "contactUs.subtitle",
                "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
              )}
            </p>

            <div className="space-y-6">
              <div className="flex items-center">
                <FiPhoneCall className="w-6 h-6 mr-4 opacity-80" />
                <div>
                  <h4 className="font-semibold">
                    {t("contactUs.phone", "Phone")}
                  </h4>
                  <p className="opacity-90">+351 912 123 123</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiMail className="w-6 h-6 mr-4 opacity-80" />
                <div>
                  <h4 className="font-semibold">
                    {t("contactUs.email", "Email")}
                  </h4>
                  <p className="opacity-90">support@autoparts.com</p>
                </div>
              </div>

              <div className="flex items-center">
                <FiMapPin className="w-6 h-6 mr-4 opacity-80" />
                <div>
                  <h4 className="font-semibold">
                    {t("contactUs.address", "Office")}
                  </h4>
                  <p className="opacity-90">
                    Rua da Tecnologia, 123
                    <br />
                    4000-000 Porto, Portugal
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-10">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              {t("contactUs.formTitle", "Send a Message")}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contactUs.nameLabel", "Full Name")}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                  placeholder={t("contactUs.namePlaceholder", "John Doe")}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contactUs.emailLabel", "Email Address")}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                  placeholder={t(
                    "contactUs.emailPlaceholder",
                    "john@example.com",
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contactUs.subjectLabel", "Subject")}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                  placeholder={t(
                    "contactUs.subjectPlaceholder",
                    "How can we help?",
                  )}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("contactUs.messageLabel", "Message")}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue resize-none"
                  placeholder={t(
                    "contactUs.messagePlaceholder",
                    "Your message here...",
                  )}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-main-blue text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting
                  ? t("contactUs.sending", "Sending...")
                  : t("contactUs.sendButton", "Send Message")}
              </button>
            </form>
          </div>
        </div>

        {/* Full Width Map Section */}
        <div className="w-full h-80 sm:h-96 border-t border-gray-100">
          <iframe
            title="Store location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3112.593926514785!2d-9.1417072!3d38.7272996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd19337e7a57c58f%3A0xb69dbaf436fc7b93!2sLisbon%2C%20Portugal!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "320px" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
