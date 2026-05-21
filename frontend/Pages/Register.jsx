import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/slices/authSlice";
import { useTranslation } from "react-i18next";

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert(t("registerPage.alerts.passwordMismatch"));
      return;
    }
    dispatch(
      registerUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      }),
    );
  };

  return (
    <main className="container mx-auto py-10 grow">
      <div className="lg:flex lg:items-stretch lg:justify-between">
        {/* LEFT SIDE - REGISTER FORM */}
        <section className="grow lg:mr-6 bg-white rounded-lg shadow-sm p-6 md:p-10 lg:px-16 lg:py-14">
          <h1 className="text-2xl md:text-3xl font-black text-center lg:text-left mb-8">
            {t("registerPage.title")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* First + Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t("registerPage.form.firstNameLabel")}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-main-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t("registerPage.form.lastNameLabel")}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-main-blue"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                {t("registerPage.form.emailLabel")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-main-blue"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                {t("registerPage.form.passwordLabel")}
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className="w-full border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-main-blue"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                {t("registerPage.form.confirmPasswordLabel")}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full border rounded-md p-4 focus:outline-none focus:ring-2 focus:ring-main-blue"
                required
              />
            </div>

            <button
              type="submit"
              className="inline-block border border-main-blue text-white bg-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-white hover:text-main-blue transition cursor-pointer"
            >
              {t("registerPage.form.submitButton")}
            </button>
          </form>

          <p className="text-sm mt-6 text-gray-500">
            {t("registerPage.form.alreadyHaveAccount")}{" "}
            <Link to="/login" className="text-main-blue underline">
              {t("registerPage.form.signInHere")}
            </Link>
          </p>
        </section>

        {/* RIGHT SIDE - BENEFITS */}
        <section className="mt-10 lg:mt-0 grow bg-gray-50 rounded-lg p-6 md:p-10 lg:px-16 lg:py-14">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            {t("registerPage.promo.title")}
          </h2>

          <h3 className="text-main-blue font-bold text-lg mb-8">
            {t("registerPage.promo.subtitle")}
          </h3>

          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>{t("registerPage.promo.benefits.trackOrders")}</span>
            </li>

            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>{t("registerPage.promo.benefits.saveInfo")}</span>
            </li>

            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>{t("registerPage.promo.benefits.offers")}</span>
            </li>

            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>{t("registerPage.promo.benefits.fastCheckout")}</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
};

export default Register;
