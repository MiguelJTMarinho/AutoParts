import React, { useState } from "react";

const PartBrandsManagement = () => {
  const brands = [
    {
      _id: 1,
      name: "Bosch",
    },
  ];

  const [formData, setFormData] = useState({
    name: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);

    setFormData({
      name: "",
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this brand?")) {
      console.log("Deleting brand:", id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Part Brands Management</h2>

      {/* FORM */}
      <div className="p-6 rounded-lg mb-6">
        <h3 className="text-lg font-bold">Add New Brand</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Add Brand
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {brands.map((b) => (
              <tr key={b._id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-900">{b.name}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartBrandsManagement;
