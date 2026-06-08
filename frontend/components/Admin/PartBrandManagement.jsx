import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  createPartBrand,
  deletePartBrand,
  fetchPartBrands,
} from "../../redux/slices/admin/adminPartBrandSlice";

const PartBrandsManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { partBrands, loading, error } = useSelector(
    (state) => state.adminPartBrands,
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    dispatch(fetchPartBrands());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createPartBrand(formData)).unwrap();
      toast.success(
        t("partBrandsManagement.toast.added", "Brand added successfully!"),
      );
      setFormData({
        name: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to create part brand:", err);
      toast.error(err?.message || "Failed to create part brand");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("partBrandsManagement.alerts.confirmDelete"))) {
      try {
        await dispatch(deletePartBrand(id)).unwrap();
        toast.success(
          t(
            "partBrandsManagement.toast.deleted",
            "Brand deleted successfully!",
          ),
        );
      } catch (err) {
        console.error("Failed to delete part brand:", err);
        toast.error(err?.message || "Failed to delete part brand");
      }
    }
  };

  const filteredBrands = partBrands?.filter((brand) => {
    if (
      searchQuery.trim() !== "" &&
      !brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold mb-4">
          {t("partBrandsManagement.title")}
        </h2>

        <div className="flex flex-1 justify-end items-center gap-4 mb-6 sm:mb-0">
          <input
            type="text"
            placeholder={t(
              "partBrandsManagement.searchPlaceholder",
              "Search by name...",
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500 bg-white min-w-50"
          />
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex w-fit items-center rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              {t("partBrandsManagement.addTitle")}
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error?.message || error || "An error occurred"}
          </div>
        )}
      </div>

      {/* FORM */}
      {showAddForm && (
        <div className="p-6 rounded-lg mb-6 bg-white border border-gray-100 shadow-sm">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              {t("partBrandsManagement.addTitle")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t(
                "partBrandsManagement.addSubtitle",
                "Fill the form below to add a new part brand.",
              )}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("partBrandsManagement.form.name")}
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-red-700 transition-all flex items-center shadow-sm cursor-pointer mr-2"
              >
                {t("partBrandsManagement.form.cancelButton", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all cursor-pointer disabled:opacity-70 flex items-center"
              >
                {loading ? "..." : t("partBrandsManagement.form.addButton")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">
                {t("partBrandsManagement.table.name")}
              </th>
              <th className="py-3 px-4">
                {t("partBrandsManagement.table.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredBrands && filteredBrands.length > 0 ? (
              filteredBrands.map((b) => (
                <tr key={b.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{b.name}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(b.id)}
                      disabled={loading}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-60 cursor-pointer"
                    >
                      {t("partBrandsManagement.table.deleteButton")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-500">
                  {loading ? "Loading brands..." : "No brands found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PartBrandsManagement;
