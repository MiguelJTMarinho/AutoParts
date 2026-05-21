import axios from "axios";
import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const PRICE_MIN = 0;
const PRICE_MAX = 5000;

const FilterSidebar = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Data from API
  const [categories, setCategories] = useState([]);
  const [partBrands, setPartBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [carBrands, setCarBrands] = useState([]);
  const [years, setYears] = useState([]);

  // Estado local para controlar as subcategorias filtradas dinamicamente
  const [subCategories, setSubCategories] = useState([]);

  //helper
  const getParam = (key) => searchParams.get(key);
  const getAll = (key) => searchParams.getAll(key);

  const extractId = (paramValue) => {
    if (!paramValue) return null;
    return paramValue.split("_")[0];
  };

  useEffect(() => {
    fetchCategories();
    fetchPartBrands();
    fetchCarBrands();
  }, []);

  // Load models when car brand changes
  useEffect(() => {
    const brandParam = getParam("carBrand");
    const brandId = extractId(brandParam);

    if (brandId) {
      fetchCarModels(brandId);
    } else {
      setCarModels([]);
    }
  }, [searchParams]);

  // Load years when model changes
  useEffect(() => {
    const brandParam = getParam("carBrand");
    const modelParam = getParam("carModel");
    const brandId = extractId(brandParam);
    const modelId = extractId(modelParam);

    if (modelId && brandId) {
      fetchYears(modelId, brandId);
    } else {
      setYears([]);
    }
  }, [searchParams]);

  // Carrega as subcategorias dependentes sempre que a categoria principal mudar na URL
  useEffect(() => {
    const parentParam = getParam("parentCategory");
    const parentId = extractId(parentParam);

    if (parentId) {
      const children = categories.filter(
        (cat) => String(cat.parent_id || cat.parentId) === String(parentId),
      );
      setSubCategories(children);
    } else {
      setSubCategories([]);
    }
  }, [searchParams, categories]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPartBrands = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/part_brands`,
      );
      setPartBrands(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCarBrands = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/car_brands`);

      setCarBrands(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCarModels = async (brandId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/car_models/brand/${brandId}`,
      );

      setCarModels(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);

    if (!value) params.delete(key);
    else params.set(key, value);

    setSearchParams(params);
  };

  const fetchYears = async (modelId, brandId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/product_compatibility/${modelId}/${brandId}`,
      );

      setYears(res.data || []);
    } catch (err) {
      console.error(err);
    }
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

    if (value) params.set("inStock", "true");
    else params.delete("inStock");

    setSearchParams(params);
  };

  const clearAll = () => setSearchParams({});

  const selectedBrand = getParam("carBrand");
  const selectedModel = getParam("carModel");
  const selectedParentCategory = getParam("parentCategory");
  const selectedCategory = getParam("category");

  const selectedPartBrand = getParam("partBrand");

  const minPrice = Number(getParam("minPrice") || PRICE_MIN);
  const maxPrice = Number(getParam("maxPrice") || PRICE_MAX);

  const inStockOnly = getParam("inStock") === "true";

  const hasFilters =
    selectedParentCategory ||
    selectedCategory ||
    selectedPartBrand ||
    minPrice > PRICE_MIN ||
    maxPrice < PRICE_MAX ||
    selectedBrand;

  // Descobre as categorias Raiz/Pai (onde parent_id é nulo)
  const mainCategories = categories.filter(
    (cat) => !cat.parent_id && !cat.parentId,
  );

  return (
    <div className="w-full p-4 space-y-6 bg-white">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold uppercase">
          {t("filterSidebar.title")}
        </h2>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-main-blue hover:underline"
          >
            {t("filterSidebar.clearAll")}
          </button>
        )}
      </div>

      {/* OEM */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          {t("filterSidebar.oem.title")}
        </h3>
        <input
          type="text"
          value={getParam("oem") || ""}
          onChange={(e) => updateParam("oem", e.target.value)}
          placeholder={t("filterSidebar.oem.placeholder")}
          className="w-full border rounded px-2 py-1 text-sm"
        />
      </div>

      {/* VEHICLE */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          {t("filterSidebar.vehicle.title")}
        </h3>

        {/* BRAND */}
        <select
          value={selectedBrand || ""}
          onChange={(e) => {
            const value = e.target.value;
            const params = new URLSearchParams(searchParams);
            params.set("carBrand", value);
            params.delete("carModel");
            params.delete("carYear");
            setSearchParams(params);
          }}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">{t("filterSidebar.vehicle.allBrands")}</option>
          {carBrands.map((brand) => (
            <option key={brand.id} value={`${brand.id}_${brand.name}`}>
              {brand.name}
            </option>
          ))}
        </select>

        {/* MODEL */}
        <select
          value={selectedModel || ""}
          onChange={(e) => {
            const value = e.target.value;
            const params = new URLSearchParams(searchParams);
            params.set("carModel", value);
            params.delete("carYear");
            setSearchParams(params);
          }}
          disabled={!selectedBrand}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">{t("filterSidebar.vehicle.allModels")}</option>
          {carModels.map((model) => (
            <option key={model.id} value={`${model.id}_${model.name}`}>
              {model.name}
            </option>
          ))}
        </select>

        {/* YEAR */}
        <select
          value={getParam("carYear") || ""}
          onChange={(e) => updateParam("carYear", e.target.value)}
          disabled={!selectedModel}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">{t("filterSidebar.vehicle.allYears")}</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* CATEGORY */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          {t("filterSidebar.category.title")}
        </h3>

        {/* Select Pai */}
        <select
          value={selectedParentCategory || ""}
          onChange={(e) => {
            const value = e.target.value;
            const params = new URLSearchParams(searchParams);

            if (!value) {
              params.delete("parentCategory");
            } else {
              params.set("parentCategory", value);
            }
            params.delete("category");
            setSearchParams(params);
          }}
          className="w-full border rounded px-2 py-1 text-sm mb-2"
        >
          <option value="">{t("filterSidebar.category.allCategories")}</option>
          {mainCategories.map((cat) => (
            <option key={cat.id} value={`${cat.id}_${cat.name}`}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Select Filho */}
        <select
          value={selectedCategory || ""}
          onChange={(e) => updateParam("category", e.target.value)}
          disabled={!selectedParentCategory}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">
            {t("filterSidebar.category.allSubcategories")}
          </option>
          {subCategories.map((sub) => (
            <option key={sub.id} value={`${sub.id}_${sub.name}`}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* BRAND (PART BRAND) */}
      {/* ALTERAÇÃO: Mapeamento por checkbox removido e substituído por um <select> limpo */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          {t("filterSidebar.partBrand.title")}
        </h3>

        <select
          value={selectedPartBrand || ""}
          onChange={(e) => updateParam("partBrand", e.target.value)}
          className="w-full border rounded px-2 py-1 text-sm"
        >
          <option value="">{t("filterSidebar.partBrand.allPartBrands")}</option>
          {partBrands.map((brand) => (
            <option key={brand.id} value={`${brand.id}_${brand.name}`}>
              {brand.name}
            </option>
          ))}
        </select>
      </div>

      {/* PRICE */}
      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="text-xs text-gray-500 uppercase font-semibold">
          {t("filterSidebar.price.title")}
        </h3>
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={minPrice}
          className="w-full"
          onChange={(e) => updatePrice(Number(e.target.value), maxPrice)}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          value={maxPrice}
          className="w-full"
          onChange={(e) => updatePrice(minPrice, Number(e.target.value))}
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>
            {t("filterSidebar.price.min")} {minPrice}€
          </span>
          <span>
            {t("filterSidebar.price.max")} {maxPrice}€
          </span>
        </div>
      </div>

      {/* STOCK */}
      <div className="border p-4 rounded-lg">
        <label className="flex gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => updateStock(e.target.checked)}
            className="accent-main-blue"
          />
          {t("filterSidebar.stock")}
        </label>
      </div>
    </div>
  );
};

export default FilterSidebar;
