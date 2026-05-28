import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { loginUser } from "../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { mergeCart } from "../redux/slices/cartSlice";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("/checkout");

  useEffect(() => {
    if (userInfo) {
      const cartItems = cart?.items || cart?.products || [];
      if (cartItems.length > 0 && guestId) {
        dispatch(mergeCart({ guestId })).then(() => {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [userInfo, guestId, cart, navigate, isCheckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <main className="container mx-auto py-10 grow">
      <div className="lg:flex lg:items-stretch lg:justify-between">
        {/* LEFT SIDE - LOGIN */}
        <section className="grow lg:mr-6 bg-white rounded-lg shadow-sm p-6 md:p-10 lg:px-16 lg:py-14">
          <h1 className="text-2xl md:text-3xl font-black text-center lg:text-left mb-8">
            {t("loginPage.title")}
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2">
                {t("loginPage.form.emailLabel")}
              </label>
              <input
                type="email"
                value={email}
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                {t("loginPage.form.passwordLabel")}
              </label>
              <input
                type="password"
                value={password}
                name="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Forgot + Remember */}
            <div className="flex flex-wrap items-center justify-between text-sm">
              <Link
                to="/forgot-password"
                className="underline hover:text-main-blue"
              >
                {t("loginPage.form.forgotPassword")}
              </Link>
            </div>

            <button
              type="submit"
              className="inline-block border border-main-blue text-white bg-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-white hover:text-main-blue transition cursor-pointer"
            >
              Sign In
            </button>
          </form>
        </section>

        {/* RIGHT SIDE - REGISTER INFO */}
        <section className="mt-10 lg:mt-0 grow bg-gray-50 rounded-lg p-6 md:p-10 lg:px-16 lg:py-14">
          <h2 className="text-2xl md:text-3xl font-black mb-4">
            {t("loginPage.registerPromo.title")}
          </h2>

          <h3 className="text-main-blue font-bold text-lg mb-8">
            {t("loginPage.registerPromo.subtitle")}
          </h3>

          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>{t("loginPage.registerPromo.benefits.trackOrders")}</span>
            </li>

            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>{t("loginPage.registerPromo.benefits.saveDetails")}</span>
            </li>

            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>{t("loginPage.registerPromo.benefits.manageReturns")}</span>
            </li>
          </ul>

          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="inline-block border border-main-blue text-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-main-blue hover:text-white transition"
          >
            {t("loginPage.registerPromo.createAccountButton")}
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Login;
