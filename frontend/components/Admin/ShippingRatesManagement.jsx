import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import {
  createShippingRate,
  deleteShippingRate,
  fetchShippingRates,
  updateShippingRate,
} from "../../redux/slices/admin/adminShippingRateSlice";

const ShippingRatesManagement = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { shippingRates, loading, error } = useSelector(
    (state) => state.adminShippingRates,
  );

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    min_weight: "",
    max_weight: "",
    price: "",
  });

  useEffect(() => {
    dispatch(fetchShippingRates());
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData({
      min_weight: "",
      max_weight: "",
      price: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        min_weight: Number(formData.min_weight),
        max_weight: Number(formData.max_weight),
        price: Number(formData.price),
      };

      if (editingId) {
        await dispatch(
          updateShippingRate({ id: editingId, data: payload }),
        ).unwrap();

        toast.success(
          t("shippingRates.toast.updated", "Shipping rate updated"),
        );
      } else {
        await dispatch(createShippingRate(payload)).unwrap();
        toast.success(
          t("shippingRates.toast.created", "Shipping rate created"),
        );
      }

      resetForm();
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Error saving shipping rate");
    }
  };

  const handleEdit = (rate) => {
    setFormData({
      min_weight: rate.min_weight,
      max_weight: rate.max_weight,
      price: rate.price,
    });

    setEditingId(rate.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        t(
          "shippingRates.confirmDelete",
          "Are you sure you want to delete this?",
        ),
      )
    )
      return;

    try {
      await dispatch(deleteShippingRate(id)).unwrap();
      toast.success(t("shippingRates.toast.deleted"));
    } catch (err) {
      toast.error(err?.message || "Delete failed");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">{t("shippingRates.title")}</h2>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {t("shippingRates.add")}
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
          {error?.message || error}
        </div>
      )}

      {/* FORM */}
      {showForm && (
        <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingId
              ? t("shippingRates.editTitle")
              : t("shippingRates.addTitle")}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              name="min_weight"
              type="number"
              step="0.01"
              value={formData.min_weight}
              onChange={handleChange}
              placeholder={t("shippingRates.form.min_weight")}
              className="border p-2 rounded"
              required
            />

            <input
              name="max_weight"
              type="number"
              step="0.01"
              value={formData.max_weight}
              onChange={handleChange}
              placeholder={t("shippingRates.form.max_weight")}
              className="border p-2 rounded"
              required
            />

            <input
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              placeholder={t("shippingRates.form.price")}
              className="border p-2 rounded"
              required
            />

            <div className="md:col-span-3 flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                {t("common.cancel")}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
              >
                {loading ? "..." : t("common.save")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="p-3">{t("shippingRates.form.min_weight")}</th>
              <th className="p-3">{t("shippingRates.form.max_weight")}</th>
              <th className="p-3">{t("shippingRates.form.price")}</th>
              <th className="p-3">{t("shippingRates.form.actions")}</th>
            </tr>
          </thead>

          <tbody>
            {shippingRates?.length > 0 ? (
              shippingRates.map((rate) => (
                <tr key={rate.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{rate.min_weight} kg</td>
                  <td className="p-3">{rate.max_weight} kg</td>
                  <td className="p-3 font-semibold">
                    {Number(rate.price).toFixed(2)} €
                  </td>

                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(rate)}
                      className="px-3 py-1 bg-blue-500 text-white rounded"
                    >
                      {t("common.edit")}
                    </button>

                    <button
                      onClick={() => handleDelete(rate.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      {t("common.delete")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  {loading ? "Loading..." : "No shipping rates found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShippingRatesManagement;
