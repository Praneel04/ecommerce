import React from "react";
import Products from "./Products";

export default function HomePage() {
  return (
    <div className="home-page">
      <div className="hero-section bg-light-color py-10 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-primary-color text-center mb-6">
            Welcome to our Store
          </h1>
          <p className="text-lg text-gray-600 text-center">
            Discover our collection of high-quality products
          </p>
        </div>
      </div>
      
      <Products />
    </div>
  );
}
