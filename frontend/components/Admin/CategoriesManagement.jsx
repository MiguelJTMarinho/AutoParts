import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
  createCategory,
  deleteCategory,
  fetchAdminCategories,
} from "../../redux/slices/admin/adminCategorySlice";

const CategoriesManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { categories, loading, error } = useSelector(
    (state) => state.adminCategories,
  );

  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent_id: "",
  });

  useEffect(() => {
    dispatch(fetchAdminCategories());
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
      const payload = {
        ...formData,
        parent_id: formData.parent_id === "" ? null : formData.parent_id,
      };
      await dispatch(createCategory(payload)).unwrap();
      toast.success(t("categoriesManagement.toast.added"));
      setFormData({
        name: "",
        description: "",
        parent_id: "",
      });
      setShowAddForm(false);
    } catch (err) {
      console.error("Failed to create category:", err);
      toast.error(err?.message || "Failed to create category");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(t("categoriesManagement.alerts.confirmDelete"))) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
        toast.success(t("categoriesManagement.toast.deleted"));
      } catch (err) {
        console.error("Failed to delete category:", err);
        toast.error(err?.message || "Failed to delete category");
      }
    }
  };

  const filteredCategories = categories?.filter((cat) => {
    if (searchQuery.trim() !== "" && !cat.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold mb-4">
          {t("categoriesManagement.title")}
        </h2>
        
        <div className="flex flex-1 justify-end items-center gap-4 mb-6 sm:mb-0">
          <input
            type="text"
            placeholder={t("categoriesManagement.searchPlaceholder", "Search by name...")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-blue-500 bg-white min-w-[200px]"
          />
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex w-fit items-center rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
            >
              {t("categoriesManagement.addTitle")}
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
              {t("categoriesManagement.addTitle")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t("categoriesManagement.addSubtitle", "Fill the form below to add a new category.")}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("categoriesManagement.form.name")}
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

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("categoriesManagement.form.description")}
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("categoriesManagement.form.parentId", "Parent Category")}
              </label>
              <select
                name="parent_id"
                value={formData.parent_id}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
              >
                <option value="">{t("categoriesManagement.form.noParent", "None")}</option>
                {categories && categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-red-700 transition-all flex items-center shadow-sm cursor-pointer mr-2"
              >
                {t("categoriesManagement.form.cancelButton", "Cancel")}
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all cursor-pointer disabled:opacity-70 flex items-center"
              >
                {loading ? "..." : t("categoriesManagement.form.addButton")}
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
                {t("categoriesManagement.table.name")}
              </th>
              <th className="py-3 px-4">
                {t("categoriesManagement.table.description")}
              </th>
              <th className="py-3 px-4">
                {t("categoriesManagement.table.parentId", "Parent ID")}
              </th>
              <th className="py-3 px-4">
                {t("categoriesManagement.table.actions")}
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredCategories && filteredCategories.length > 0 ? (
              filteredCategories.map((cat) => (
                <tr key={cat.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="p-4">{cat.description}</td>
                  <td className="p-4 text-gray-500">
                    {cat.parent_id ? categories.find(c => c.id === cat.parent_id)?.name || cat.parent_id : "-"}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      disabled={loading}
                      className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:opacity-60 cursor-pointer"
                    >
                      {t("categoriesManagement.table.deleteButton")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  {loading ? "Loading categories..." : "No categories found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesManagement;
