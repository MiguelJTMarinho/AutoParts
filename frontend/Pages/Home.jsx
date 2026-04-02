import React from "react";
import Hero from "../components/Layout/Hero";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";

const Home = () => {
  return (
    <div>
      <Hero />
      <NewArrivals />

      {/* Best Seller 
      <h2 className="text-3xl text-center font-bold mb-4">Best Seller</h2>
      <ProductDetails />*/}

      <FeaturedCollection />
      <FeaturesSection />
    </div>
  );
};

export default Home;
