import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createProductWithImages } from "../../redux/slices/admin/adminProductSlice";

const API_URL = `${import.meta.env.VITE_API_URL}`;

const initialProductData = {
  name: "",
  description: "",
  summary: "",
  sku: "",
  price: "",
  condition: "used",
  stock: 1,
  category_id: "",
  brand_id: "",
  status: "active",
  is_active: true,
  compatibility: [
    {
      carbrand_id: "",
      carmodel_id: "",
      year_start: "",
      year_end: "",
    },
  ],
  oem_references: [
    {
      reference_code: "",
      brand: "",
      type: "OEM",
    },
  ],
};

const AddProductPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.adminProducts);

  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [partBrands, setPartBrands] = useState([]);
  const [productData, setProductData] = useState(initialProductData);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        const [carBrandsRes, carModelsRes, categoriesRes, partBrandsRes] =
          await Promise.all([
            axios.get(`${API_URL}/car_brands`),
            axios.get(`${API_URL}/car_models`),
            axios.get(`${API_URL}/categories`),
            axios.get(`${API_URL}/part_brands`),
          ]);

        setCarBrands(carBrandsRes.data || []);
        setCarModels(carModelsRes.data || []);
        setCategories(categoriesRes.data || []);
        setPartBrands(partBrandsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch product form options:", err);
      }
    };

    fetchFormOptions();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "is_active" && checked && prev.status === "inactive"
        ? { status: "active" }
        : {}),
      ...(name === "is_active" && !checked ? { status: "inactive" } : {}),
      ...(name === "status" && value === "inactive"
        ? { is_active: false }
        : {}),
      ...(name === "status" && value !== "inactive" ? { is_active: true } : {}),
    }));
  };

  const handleCompatibilityChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...productData.compatibility];
    updated[index][name] = value;

    if (name === "carbrand_id") {
      updated[index].carmodel_id = "";
    }

    setProductData({ ...productData, compatibility: updated });
  };

  const addCompatibility = () => {
    setProductData((prev) => ({
      ...prev,
      compatibility: [
        ...prev.compatibility,
        {
          carbrand_id: "",
          carmodel_id: "",
          year_start: "",
          year_end: "",
        },
      ],
    }));
  };

  const removeCompatibility = (index) => {
    const updated = productData.compatibility.filter((_, i) => i !== index);
    setProductData({ ...productData, compatibility: updated });
  };

  const handleOemChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...productData.oem_references];
    updated[index][name] = value;
    setProductData({ ...productData, oem_references: updated });
  };

  const addOem = () => {
    setProductData((prev) => ({
      ...prev,
      oem_references: [
        ...prev.oem_references,
        {
          reference_code: "",
          brand: "",
          type: "OEM",
        },
      ],
    }));
  };

  const removeOem = (index) => {
    const updated = productData.oem_references.filter((_, i) => i !== index);
    setProductData({ ...productData, oem_references: updated });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    setImageFiles(files);
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const getModelsByBrand = (brandId) => {
    return carModels.filter(
      (model) => String(model.carbrand_id) === String(brandId),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const productPayload = {
      name: productData.name,
      description: productData.description,
      summary: productData.summary,
      sku: productData.sku,
      price: Number(productData.price),
      condition: productData.condition,
      stock: Number(productData.stock || 0),
      category_id: productData.category_id || null,
      brand_id: productData.brand_id || null,
      status: productData.status,
      is_active: productData.is_active,
    };

    try {
      await dispatch(
        createProductWithImages({
          productData: productPayload,
          imageFiles,
          compatibility: productData.compatibility,
          oemReferences: productData.oem_references,
        }),
      ).unwrap();

      navigate("/admin/products");

      // Clear variables
      productData.name = "";
      productData.description = "";
      productData.summary = "";
      productData.sku = "";
      productData.price = "";
      productData.condition = "used";
      productData.stock = 1;
      productData.category_id = "";
      productData.brand_id = "";
      productData.status = "active";
      productData.is_active = true;
      productData.compatibility = [];
      productData.oem_references = [];
      setImageFiles([]);
      setImagePreviews([]);
      setProductData(initialProductData);
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">
        {t("productManagement.addTitle")}
      </h2>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700">
            {t("editProductPage.form.productNameLabel")}
          </label>
          <input
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder={t("editProductPage.form.productNamePlaceholder")}
            className="w-full border p-2 rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700">
            {t("editProductPage.form.descriptionLabel")}
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-gray-700">
              {t("productManagement.table.sku")}
            </label>
            <input
              name="sku"
              value={productData.sku}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-gray-700">
              {t("editProductPage.form.priceLabel")}
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700">
              {t("editProductPage.form.stockLabel")}
            </label>
            <input
              type="number"
              min="0"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">
              {t("editProductPage.form.categoryLabel")}
            </label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="w-full px-2 py-3 border rounded"
            >
              <option value="">
                {t("editProductPage.form.selectCategory")}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">
              {t("editProductPage.form.partBrandLabel")}
            </label>
            <select
              name="brand_id"
              value={productData.brand_id}
              onChange={handleChange}
              className="w-full px-2 py-3 border rounded"
            >
              <option value="">{t("editProductPage.form.selectBrand")}</option>
              {partBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">
              {t("productManagement.form.condition")}
            </label>
            <select
              name="condition"
              value={productData.condition}
              onChange={handleChange}
              className="w-full px-2 py-3 border rounded"
            >
              <option value="used">
                {t("productManagement.conditions.used")}
              </option>
              <option value="new">
                {t("productManagement.conditions.new")}
              </option>
              <option value="refurbished">
                {t("productManagement.conditions.refurbished")}
              </option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700">
              {t("productManagement.form.status")}
            </label>
            <select
              name="status"
              value={productData.status}
              onChange={handleChange}
              className="w-full px-2 py-3 border rounded"
            >
              <option value="active">
                {t("productManagement.status.active")}
              </option>
              <option value="reserved">
                {t("productManagement.status.reserved")}
              </option>
              <option value="sold">{t("productManagement.status.sold")}</option>
              <option value="inactive">
                {t("productManagement.status.inactive")}
              </option>
            </select>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">
            {t("editProductPage.compatibility.title")}
          </h3>

          {productData.compatibility.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3"
            >
              <div>
                <label className="text-sm text-gray-600">
                  {t("editProductPage.compatibility.brandLabel")}
                </label>
                <select
                  name="carbrand_id"
                  value={item.carbrand_id}
                  onChange={(e) => handleCompatibilityChange(index, e)}
                  className="w-full px-2 py-3 border rounded"
                >
                  <option value="">
                    {t("editProductPage.compatibility.brandLabel")}
                  </option>
                  {carBrands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  {t("editProductPage.compatibility.modelLabel")}
                </label>
                <select
                  name="carmodel_id"
                  value={item.carmodel_id}
                  onChange={(e) => handleCompatibilityChange(index, e)}
                  className="w-full px-2 py-3 border rounded"
                  disabled={!item.carbrand_id}
                >
                  <option value="">
                    {t("editProductPage.compatibility.modelLabel")}
                  </option>
                  {getModelsByBrand(item.carbrand_id).map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  {t("editProductPage.compatibility.yearFromLabel")}
                </label>
                <input
                  type="number"
                  name="year_start"
                  value={item.year_start}
                  onChange={(e) => handleCompatibilityChange(index, e)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  {t("editProductPage.compatibility.yearToLabel")}
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="year_end"
                    value={item.year_end}
                    onChange={(e) => handleCompatibilityChange(index, e)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeCompatibility(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
                  >
                    X
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addCompatibility}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          >
            {t("editProductPage.compatibility.addButton")}
          </button>
        </div>

        <div>
          <label className="block text-gray-700">
            {t("editProductPage.oem.title")}
          </label>

          {productData.oem_references.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3"
            >
              <div>
                <label className="text-sm text-gray-600">
                  {t("editProductPage.oem.codeLabel")}
                </label>
                <input
                  name="reference_code"
                  value={item.reference_code}
                  onChange={(e) => handleOemChange(index, e)}
                  className="w-full p-2 border rounded"
                  placeholder={t("editProductPage.oem.codePlaceholder")}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  {t("editProductPage.oem.brandLabel")}
                </label>
                <input
                  name="brand"
                  value={item.brand}
                  onChange={(e) => handleOemChange(index, e)}
                  className="w-full p-2 border rounded"
                  placeholder={t("editProductPage.oem.brandPlaceholder")}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  {t("editProductPage.oem.typeLabel")}
                </label>
                <select
                  name="type"
                  value={item.type}
                  onChange={(e) => handleOemChange(index, e)}
                  className="w-full px-2 py-3 border rounded"
                >
                  <option value="OEM">
                    {t("editProductPage.oem.types.oem")}
                  </option>
                  <option value="Compatible">
                    {t("editProductPage.oem.types.compatible")}
                  </option>
                  <option value="Aftermarket">
                    {t("editProductPage.oem.types.aftermarket")}
                  </option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => removeOem(index)}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
                >
                  X
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addOem}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer"
          >
            {t("editProductPage.oem.addButton", "Adicionar Referência OEM")}
          </button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">
            {t("editProductPage.images.title")}
          </h3>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full border p-2 rounded-md"
          />

          {imagePreviews.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-3">
              {imagePreviews.map((preview, index) => (
                <img
                  key={preview}
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-md border"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={productData.is_active}
            onChange={handleChange}
          />
          <label>{t("editProductPage.form.isActive")}</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 cursor-pointer disabled:opacity-60"
        >
          {loading
            ? t("productManagement.form.saving")
            : t("productManagement.form.addButton")}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
