import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

/* ================= CONSTANTS ================= */

const VEHICLE_DATA = {
  Audi: {
    A4: ["2014", "2015", "2016"],
    A3: ["2013", "2014"],
  },
  BMW: {
    "Série 3": ["2010", "2011", "2012"],
    "Série 5": ["2015", "2016"],
  },
};

const CATEGORIES = [
  "Brake System",
  "Engine Parts",
  "Filters",
  "Suspension",
  "Electrical",
];

const BRANDS = ["Bosch", "Brembo", "NGK", "Denso"];

const PRICE_MIN = 0;
const PRICE_MAX = 500;

/* ================= COMPONENT ================= */

const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ================= HELPERS ================= */

  const getParam = (key) => searchParams.get(key);
  const getAll = (key) => searchParams.getAll(key);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) params.delete(key);
    else params.set(key, value);

    setSearchParams(params);
  };

  const updateArrayParam = (key, value) => {
    const current = getAll(key);

    const newValues = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    const params = new URLSearchParams(searchParams);
    params.delete(key);
    newValues.forEach((v) => params.append(key, v));

    setSearchParams(params);
  };

  const updatePrice = (min, max) => {
    if (min > max) return;

    const params = new URLSearchParams(searchParams);
    params.set("minPrice", min);
    params.set("maxPrice", max);

    setSearchParams(params);
  };

  const updateStock = (value) => {
    const params = new URLSearchParams(searchParams);

    if (value) params.set("stock", "true");
    else params.delete("stock");

    setSearchParams(params);
  };

  const clearAll = () => setSearchParams({});

  /* ================= VALUES ================= */

  const selectedBrand = getParam("vehicleBrand");
  const selectedModel = getParam("vehicleModel");

  const selectedCategories = getAll("category");
  const selectedBrands = getAll("brand");

  const minPrice = Number(getParam("minPrice") || PRICE_MIN);
  const maxPrice = Number(getParam("maxPrice") || PRICE_MAX);

  const inStockOnly = getParam("stock") === "true";

  /* ================= DERIVED ================= */

  const models = selectedBrand ? Object.keys(VEHICLE_DATA[selectedBrand]) : [];
  const years =
    selectedBrand && selectedModel
      ? VEHICLE_DATA[selectedBrand][selectedModel]
      : [];

  const hasFilters =
    selectedCategories.length ||
    selectedBrands.length ||
    minPrice > PRICE_MIN ||
    maxPrice < PRICE_MAX ||
    selectedBrand;

  /* ================= UI ================= */

  return (
    <div className="w-full p-4 space-y-6 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold uppercase">Filters</h2>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-main-blue hover:underline"
          >
            Clear All
          </button>
        )}
      </div>
      {/* OEM */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          OEM Part Number
        </h3>

        <input
          type="text"
          value={getParam("oem") || ""}
          onChange={(e) => updateParam("oem", e.target.value)}
          placeholder="Enter OEM number..."
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>
      {/* VEHICLE */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          Vehicle
        </h3>

        {/* BRAND */}
        <select
          value={selectedBrand || ""}
          onChange={(e) => {
            const value = e.target.value;

            const params = new URLSearchParams(searchParams);
            params.set("vehicleBrand", value);
            params.delete("vehicleModel");
            params.delete("vehicleYear");

            setSearchParams(params);
          }}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">All brands</option>
          {Object.keys(VEHICLE_DATA).map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        {/* MODEL */}
        <select
          value={selectedModel || ""}
          onChange={(e) => {
            const value = e.target.value;

            const params = new URLSearchParams(searchParams);
            params.set("vehicleModel", value);
            params.delete("vehicleYear");

            setSearchParams(params);
          }}
          disabled={!selectedBrand}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">All models</option>
          {(VEHICLE_DATA[selectedBrand] || {}) &&
            Object.keys(VEHICLE_DATA[selectedBrand] || {}).map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
        </select>

        {/* YEAR */}
        <select
          value={getParam("vehicleYear") || ""}
          onChange={(e) => {
            const value = e.target.value;

            const params = new URLSearchParams(searchParams);
            params.set("vehicleYear", value);

            setSearchParams(params);
          }}
          disabled={!selectedModel}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">All years</option>
          {selectedBrand &&
            selectedModel &&
            (VEHICLE_DATA[selectedBrand]?.[selectedModel] || []).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
        </select>
      </div>
      {/* CATEGORY */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          Category
        </h3>

        {CATEGORIES.map((cat) => (
          <label key={cat} className="flex gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedCategories.includes(cat)}
              onChange={() => updateArrayParam("category", cat)}
              className="accent-main-blue"
            />
            {cat}
          </label>
        ))}
      </div>
      {/* BRAND (PART BRAND) */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          Part Brand
        </h3>

        {BRANDS.map((b) => (
          <label key={b} className="flex gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={selectedBrands.includes(b)}
              onChange={() => updateArrayParam("brand", b)}
              className="accent-main-blue"
            />
            {b}
          </label>
        ))}
      </div>
      {/* PRICE */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">Price</h3>

        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={minPrice}
          onChange={(e) => updatePrice(Number(e.target.value), maxPrice)}
        />

        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={maxPrice}
          onChange={(e) => updatePrice(minPrice, Number(e.target.value))}
        />

        <div className="flex justify-between text-xs text-gray-500">
          <span>Min. {minPrice}€</span>
          <span>Max. {maxPrice}€</span>
        </div>
      </div>
      {/* STOCK */}{" "}
      <div className="border p-4 rounded-lg">
        {" "}
        <label className="flex gap-2 text-sm cursor-pointer">
          {" "}
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateStock(e.target.checked)}
            className="accent-main-blue"
          />{" "}
          In Stock Only{" "}
        </label>{" "}
      </div>
    </div>
  );
};

export default FilterSidebar;
