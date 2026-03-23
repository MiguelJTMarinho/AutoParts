import React from "react";
import heroImg from "../../src/assets/hero.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative">
      <img
        src={heroImg}
        alt="AutoParts"
        className="w-full h-100 md:h-150 lg:h-187.5 object-cover"
      />
      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4">
            Auto Parts
          </h1>
          <p className="text-sm tracking-tighter md:text-lg mb-6">
            Explore our wide range of auto parts.
          </p>
          <Link
            to="/collections/all"
            className="bg-white text-gray-950 px-6 py-2 rounded-sm text-lg"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
