import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import axios from "axios";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError(t("resetPassword.error.mismatch", "Passwords do not match."));
      return;
    }

    if (formData.password.length < 8) {
      setError(
        t(
          "resetPassword.error.tooShort",
          "Password must be at least 8 characters.",
        ),
      );
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/reset_password`, {
        token,
        password: formData.password,
      });
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          t(
            "resetPassword.error.generic",
            "Something went wrong. The link may have expired.",
          ),
      );
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <main className="container mx-auto py-10 grow">
        <div className="lg:flex lg:items-stretch lg:justify-between">
          <section className="grow bg-white rounded-lg shadow-sm p-6 md:p-10 lg:px-16 lg:py-14 flex flex-col items-center lg:items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-black">
              {t("resetPassword.invalidToken.title", "Invalid reset link")}
            </h1>
            <p className="text-gray-500 text-sm">
              {t(
                "resetPassword.invalidToken.subtitle",
                "This password reset link is invalid or has expired.",
              )}
            </p>
            <Link
              to="/forgot-password"
              className="inline-block border border-main-blue text-white bg-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-white hover:text-main-blue transition"
            >
              {t("resetPassword.invalidToken.requestNew", "Request a new link")}
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto py-10 grow">
      <div className="lg:flex lg:items-stretch lg:justify-between">
        {/* LEFT SIDE - FORM */}
        <section className="grow lg:mr-6 bg-white rounded-lg shadow-sm p-6 md:p-10 lg:px-16 lg:py-14">
          <h1 className="text-2xl md:text-3xl font-black text-center lg:text-left mb-2">
            {t("resetPassword.title", "Reset your password")}
          </h1>
          <p className="text-gray-500 text-sm mb-8 text-center lg:text-left">
            {t(
              "resetPassword.subtitle",
              "Choose a new secure password for your account.",
            )}
          </p>

          {submitted ? (
            <div className="flex flex-col items-center lg:items-start gap-4 py-6">
              <div className="w-12 h-12 rounded-full bg-main-blue/10 flex items-center justify-center">
                <HiCheck className="text-main-blue text-2xl" />
              </div>
              <h2 className="text-lg font-bold">
                {t("resetPassword.success.title", "Password updated!")}
              </h2>
              <p className="text-gray-500 text-sm">
                {t(
                  "resetPassword.success.subtitle",
                  "Your password has been changed. Redirecting you to login…",
                )}
              </p>
              <Link
                to="/login"
                className="mt-4 inline-block border border-main-blue text-white bg-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-white hover:text-main-blue transition"
              >
                {t("resetPassword.success.backToLogin", "Back to login")}
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t("resetPassword.form.passwordLabel", "New password")}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={t(
                    "resetPassword.form.passwordPlaceholder",
                    "At least 8 characters",
                  )}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t(
                    "resetPassword.form.confirmPasswordLabel",
                    "Confirm new password",
                  )}
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder={t(
                    "resetPassword.form.confirmPasswordPlaceholder",
                    "Repeat your password",
                  )}
                  className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  autoComplete="new-password"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-block border border-main-blue text-white bg-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-white hover:text-main-blue transition cursor-pointer disabled:opacity-60"
              >
                {loading
                  ? t("resetPassword.form.saving", "Saving…")
                  : t("resetPassword.form.submit", "Reset password")}
              </button>

              <p className="text-sm text-gray-500">
                {t(
                  "resetPassword.form.rememberPassword",
                  "Remembered your password?",
                )}{" "}
                <Link to="/login" className="text-main-blue underline">
                  {t("resetPassword.form.signIn", "Sign in")}
                </Link>
              </p>
            </form>
          )}
        </section>

        {/* RIGHT SIDE - INFO */}
        <section className="mt-10 lg:mt-0 grow bg-gray-50 rounded-lg p-6 md:p-10 lg:px-16 lg:py-14">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            {t("resetPassword.info.title", "Keep your account safe")}
          </h2>

          <h3 className="text-main-blue font-bold text-lg mb-8">
            {t("resetPassword.info.subtitle", "Tips for a strong password")}
          </h3>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "resetPassword.info.tips.length",
                  "Use at least 8 characters",
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "resetPassword.info.tips.mix",
                  "Mix uppercase, lowercase, numbers and symbols",
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "resetPassword.info.tips.unique",
                  "Don't reuse passwords from other sites",
                )}
              </span>
            </li>
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue shrink-0" />
              <span>
                {t(
                  "resetPassword.info.tips.share",
                  "Never share your password with anyone",
                )}
              </span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default ResetPassword;
