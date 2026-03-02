import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandFacebook, TbBrandInstagram } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";
import logo from "../../src/assets/LogoNoBg.png";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 px-4 lg:px-0">
        <div>
          <Link to="/" className="text-3xl font-medium">
            <img src={logo} alt="AutoParts Logo" className="h-10 w-auto" />
          </Link>
        </div>
        {/* Column 1 - Newsletter */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-6">
            Be the first to hear about new products.
          </p>

          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 text-sm rounded-r-md hover:bg-gray-800"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Column 2 - Support */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#">Contact us</Link>
            </li>
            <li>
              <Link to="#">About us</Link>
            </li>
            <li>
              <Link to="#">FAQs</Link>
            </li>
            <li>
              <Link to="#">Features</Link>
            </li>
          </ul>
        </div>

        {/* Column 3 - Follow Us */}
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Follow us</h3>

          <div className="flex items-center space-x-4 mb-6">
            <TbBrandFacebook className="h-5 w-5" />
            <IoLogoInstagram className="h-5 w-5" />
            <RiTwitterXLine className="h-4 w-4" />
          </div>

          <p className="text-gray-500">Call Us</p>
          <p className="flex items-center mt-2">
            <FiPhoneCall className="mr-2" />
            912 123 123
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm text-center">
          ©2025 AutoParts. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
