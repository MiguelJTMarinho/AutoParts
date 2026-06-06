import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import axios from "axios";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/users/forgot_password`,
        { email },
      );
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t("forgotPassword.error", "Something went wrong. Please try again."),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 grow">
      <div className="lg:flex lg:items-stretch lg:justify-between">
        {/* LEFT SIDE - FORM */}
        <section className="grow lg:mr-6 bg-white rounded-lg shadow-sm p-6 md:p-10 lg:px-16 lg:py-14">
          <h1 className="text-2xl md:text-3xl font-black text-center lg:text-left mb-2">
            {t("forgotPassword.title", "Forgot your password?")}
          </h1>
          <p className="text-gray-500 text-sm mb-8 text-center lg:text-left">
            {t(
              "forgotPassword.subtitle",
              "Enter your email and we'll send you a reset link.",
            )}
          </p>

          {submitted ? (
            <div className="flex flex-col items-center lg:items-start gap-4 py-6">
              <div className="w-12 h-12 rounded-full bg-main-blue/10 flex items-center justify-center">
                <HiCheck className="text-main-blue text-2xl" />
              </div>
              <h2 className="text-lg font-bold">
                {t("forgotPassword.success.title", "Check your inbox")}
              </h2>
              <p className="text-gray-500 text-sm">
                {t(
                  "forgotPassword.success.subtitle",
                  "If an account exists for",
                )}{" "}
                <span className="font-semibold text-gray-700">{email}</span>
                {t(
                  "forgotPassword.success.suffix",
                  ", you'll receive a reset link shortly.",
                )}
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block border border-main-blue text-white bg-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-white hover:text-main-blue transition"
              >
                {t("forgotPassword.success.backToLogin", "Back to login")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t("forgotPassword.form.emailLabel", "Email address")}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t(
                    "forgotPassword.form.emailPlaceholder",
                    "Enter your email",
                  )}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="email"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-block border border-main-blue text-white bg-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-white hover:text-main-blue transition cursor-pointer disabled:opacity-60"
              >
                {loading
                  ? t("forgotPassword.form.sending", "Sending…")
                  : t("forgotPassword.form.submit", "Send reset link")}
              </button>

              <p className="text-sm text-gray-500">
                {t(
                  "forgotPassword.form.rememberPassword",
                  "Remembered your password?",
                )}{" "}
                <Link to="/login" className="text-main-blue underline">
                  {t("forgotPassword.form.signIn", "Sign in")}
                </Link>
              </p>
            </form>
          )}
        </section>

        {/* RIGHT SIDE - INFO */}
        <section className="mt-10 lg:mt-0 grow bg-gray-50 rounded-lg p-6 md:p-10 lg:px-16 lg:py-14">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            {t("forgotPassword.info.title", "How it works")}
          </h2>

          <h3 className="text-main-blue font-bold text-lg mb-8">
            {t(
              "forgotPassword.info.subtitle",
              "Simple and secure password reset",
            )}
          </h3>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "forgotPassword.info.steps.email",
                  "Enter the email linked to your account",
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "forgotPassword.info.steps.link",
                  "We'll send you a secure reset link",
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "forgotPassword.info.steps.reset",
                  "Click the link and choose a new password",
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "forgotPassword.info.steps.login",
                  "Sign in with your new credentials",
                )}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default ForgotPassword;
