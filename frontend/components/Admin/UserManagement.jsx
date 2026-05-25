import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from "../../redux/slices/admin/adminUsersSlice";

const UserManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.adminUsers);

  const [showAddForm, setShowAddForm] = useState(false);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "customer", //Default role
  });

  useEffect(() => {
    dispatch(fetchUsers());
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
      await dispatch(createUser(formData)).unwrap();

      // Reset the form after Submission
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        role: "customer",
      });
    } catch (err) {
      console.error("Failed to create user:", err);
    }
  };

  const handleRoleChange = (userId, newRole) => {
    dispatch(updateUser({ id: userId, userData: { role: newRole } }));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm(t("userManagement.alerts.confirmDelete"))) {
      dispatch(deleteUser(userId));
    }
  };

  const getUserName = (user) => {
    const fullName = [user.first_name, user.last_name]
      .filter(Boolean)
      .join(" ");
    return fullName || user.username || user.email;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{t("userManagement.title")}</h2>
      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Add New User Show form Button */}
      {!showAddForm && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-blue-700 transition-all flex items-center shadow-sm cursor-pointer"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              ></path>
            </svg>
            {t("userManagement.addTitle")}
          </button>
        </div>
      )}

      {/* Add New User Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
          <div className="mb-6 pb-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800">
              {t("userManagement.addTitle")}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {t("userManagement.addSubtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Primeira Linha: Nome e Apelido */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("registerPage.form.firstNameLabel")}
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("registerPage.form.lastNameLabel")}
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Segunda Linha: Email (Ocupa a largura toda) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                {t("userManagement.form.email")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                required
              />
            </div>

            {/* Terceira Linha: Password e Função */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("userManagement.form.password")}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  {t("userManagement.form.role")}
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none cursor-pointer"
                >
                  <option value="customer">
                    {t("userManagement.roles.customer")}
                  </option>
                  <option value="admin">
                    {t("userManagement.roles.admin")}
                  </option>
                </select>
              </div>
            </div>

            {/* Botão de Submissão */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={() => setShowAddForm(false)}
                className="bg-red-600 text-white font-medium py-2.5 px-5 rounded-lg hover:bg-red-700 transition-all flex items-center shadow-sm cursor-pointer mr-2"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white font-medium py-2.5 px-6 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-200 transition-all cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    A guardar...
                  </>
                ) : (
                  t("userManagement.form.addButton")
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* User List Managment */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">{t("userManagement.table.name")}</th>
              <th className="py-3 px-4">{t("userManagement.table.email")}</th>
              <th className="py-3 px-4">{t("userManagement.table.role")}</th>
              <th className="py-3 px-4">{t("userManagement.table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {getUserName(user)}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      className="p-2 border rounded"
                      disabled={loading}
                    >
                      <option value="customer">
                        {t("userManagement.roles.customer")}
                      </option>
                      <option value="admin">
                        {t("userManagement.roles.admin")}
                      </option>
                    </select>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loading}
                      className="bg-red-500 text-white py-2 px-4 hover:bg-red-600 rounded cursor-pointer"
                    >
                      {t("userManagement.table.deleteButton")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  {loading ? "Loading users..." : "No users found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
