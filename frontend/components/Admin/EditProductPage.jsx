import React, { useEffect, useState } from "react";

const EditProductPage = () => {
  // API
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [partBrands, setPartBrands] = useState([]);

  const [productData, setProductData] = useState({
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

    images: [
      {
        image_url: "https://picsum.photos/150?random=1",
        external_uuid: "",
        sort_order: 0,
      },
    ],
  });

  // =========================
  // HANDLERS GENERICOS
  // =========================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =========================
  // COMPATIBILITY
  // =========================
  const handleCompatibilityChange = (index, e) => {
    const { name, value } = e.target;

    const updated = [...productData.compatibility];
    updated[index][name] = value;

    // reset model se brand mudar
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

  // =========================
  // OEM
  // =========================
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

  // =========================
  // FILTER MODELS POR BRAND
  // =========================
  const getModelsByBrand = (brandId) => {
    return carModels.filter((m) => m.carbrand_id === brandId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(productData);
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAME */}
        <div>
          <label className="block text-gray-700">Product Name</label>
          <input
            name="name"
            value={productData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full border p-2 rounded-md"
          />
        </div>

        {/* PRICE + STOCK */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Price (€)</label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-gray-700">Stock</label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* CATEGORY + BRAND */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700">Category</label>
            <select
              name="category_id"
              value={productData.category_id}
              onChange={handleChange}
              className="w-full px-2 py-3 border rounded"
            >
              <option value="">Select Category</option>

              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700">Part Brand</label>
            <select
              name="brand_id"
              value={productData.brand_id}
              onChange={handleChange}
              className="w-full px-2 py-3 border rounded"
            >
              <option value="">Select Brand</option>

              {partBrands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* =========================
            COMPATIBILITY
        ========================= */}
        <div>
          <h3 className="text-xl font-semibold mb-3">Compatibility</h3>

          {productData.compatibility.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-3">
              <div>
                <label className="text-sm text-gray-600">Brand</label>
                <select
                  name="carbrand_id"
                  value={item.carbrand_id}
                  onChange={(e) => handleCompatibilityChange(index, e)}
                  className="w-full px-2 py-3 border rounded"
                >
                  <option value="">Brand</option>
                  {carBrands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Model</label>
                <select
                  name="carmodel_id"
                  value={item.carmodel_id}
                  onChange={(e) => handleCompatibilityChange(index, e)}
                  className="w-full px-2 py-3 border rounded"
                  disabled={!item.carbrand_id}
                >
                  <option value="">Model</option>

                  {getModelsByBrand(item.carbrand_id).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">Year From</label>
                <input
                  type="number"
                  name="year_start"
                  value={item.year_start}
                  onChange={(e) => handleCompatibilityChange(index, e)}
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600">Year To</label>
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
            Add Compatibility
          </button>
        </div>

        {/* =========================
            OEM REFERENCES
        ========================= */}
        <div>
          <label className="block text-gray-700">OEM References</label>

          {productData.oem_references.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 mb-3">
              {/* OEM CODE */}
              <div>
                <label className="text-sm text-gray-600">Code</label>
                <input
                  name="reference_code"
                  value={item.reference_code}
                  onChange={(e) => handleOemChange(index, e)}
                  className="w-full p-2 border rounded"
                  placeholder="OEM Code"
                />
              </div>

              {/* BRAND */}
              <div>
                <label className="text-sm text-gray-600">Brand</label>
                <input
                  name="brand"
                  value={item.brand}
                  onChange={(e) => handleOemChange(index, e)}
                  className="w-full p-2 border rounded"
                  placeholder="Brand"
                />
              </div>

              {/* TYPE */}
              <div>
                <label className="text-sm text-gray-600">Type</label>
                <select
                  name="type"
                  value={item.type}
                  onChange={(e) => handleOemChange(index, e)}
                  className="w-full px-2 py-3 border rounded"
                >
                  <option value="OEM">OEM</option>
                  <option value="Compatible">Compatible</option>
                  <option value="Aftermarket">Aftermarket</option>
                </select>
              </div>

              {/* REMOVE */}
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
        </div>

        {/* =========================
            IMAGES
        ========================= */}

        <div>
          <h3 className="text-xl font-semibold mb-3">Images</h3>

          {productData.images.map((img, index) => (
            <div key={index} className="flex items-center gap-2 mb-3">
              {/* IMAGE URL INPUT */}
              <input
                type="text"
                value={img.image_url}
                onChange={(e) => {
                  const updated = [...productData.images];
                  updated[index].image_url = e.target.value;
                  setProductData({ ...productData, images: updated });
                }}
                placeholder="Image URL"
                className="flex-1 border p-2 rounded-md"
              />

              {/* SORT ORDER */}
              <input
                type="number"
                value={img.sort_order}
                onChange={(e) => {
                  const updated = [...productData.images];
                  updated[index].sort_order = e.target.value;
                  setProductData({ ...productData, images: updated });
                }}
                placeholder="Order"
                className="w-20 border p-2 rounded-md"
              />

              {/* PREVIEW */}
              {img.image_url && (
                <img
                  src={img.image_url}
                  alt="preview"
                  className="w-16 h-16 object-cover rounded-md"
                />
              )}

              {/* REMOVE */}
              <button
                type="button"
                onClick={() => {
                  const updated = productData.images.filter(
                    (_, i) => i !== index,
                  );
                  setProductData({ ...productData, images: updated });
                }}
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 cursor-pointer"
              >
                X
              </button>
            </div>
          ))}

          {/* ADD IMAGE */}
          <button
            type="button"
            onClick={() => {
              setProductData((prev) => ({
                ...prev,
                images: [
                  ...prev.images,
                  { image_url: "", external_uuid: "", sort_order: 0 },
                ],
              }));
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Image
          </button>
        </div>

        {/* ACTIVE */}
        <div className="flex gap-2">
          <input
            type="checkbox"
            name="is_active"
            checked={productData.is_active}
            onChange={handleChange}
          />
          <label>Active Product</label>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 cursor-pointer"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
