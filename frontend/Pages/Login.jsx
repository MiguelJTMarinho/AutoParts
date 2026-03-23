import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiCheck } from "react-icons/hi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <main className="container mx-auto py-10 grow">
      <div className="lg:flex lg:items-stretch lg:justify-between">
        {/* LEFT SIDE - LOGIN */}
        <section className="grow lg:mr-6 bg-white rounded-lg shadow-sm p-6 md:p-10 lg:px-16 lg:py-14">
          <h1 className="text-2xl md:text-3xl font-black text-center lg:text-left mb-8">
            Sign in
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
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
                Forgot your password?
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
            Don’t have an account?
          </h2>

          <h3 className="text-main-blue font-bold text-lg mb-8">
            Quick and Easy!
          </h3>

          <ul className="space-y-4 mb-10">
            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>Track your orders</span>
            </li>

            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>Save your shipping and billing details</span>
            </li>

            <li className="flex items-center gap-3">
              <HiCheck className="text-main-blue" />
              <span>Manage returns online</span>
            </li>
          </ul>

          <Link
            to="/register"
            className="inline-block border border-main-blue text-main-blue px-8 py-3 uppercase font-bold rounded-md hover:bg-main-blue hover:text-white transition"
          >
            Create Account
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Login;
