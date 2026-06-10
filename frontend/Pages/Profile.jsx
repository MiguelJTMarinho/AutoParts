import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { clearCart } from "../redux/slices/cartSlice";
import { HiOutlinePencil, HiOutlineTrash, HiPlus } from "react-icons/hi2";
import { deleteUser } from "../../redux/slices/admin/adminUsersSlice";

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [addressModal, setAddressModal] = useState(null);
  const [addressForm, setAddressForm] = useState({
    title: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    postal_code: "",
    country: "",
  });

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nif: "",
    avatar: "https://picsum.photos/500/500?1",
  });

  const handleDeleteUser = (userId) => {
    if (window.confirm(t("userManagement.alerts.confirmDelete"))) {
      dispatch(deleteUser(userId));
    }
  };

  const config = { withCredentials: true };

  const fetchAddresses = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/addresses`,
        config,
      );
      setAddresses(data || []);
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    setProfileData({
      firstName: userInfo.first_name || "",
      lastName: userInfo.last_name || "",
      email: userInfo.email || "",
      phone: userInfo.phone_number || "",
      nif: userInfo.nif || "",
      avatar: userInfo.avatar_url || "https://picsum.photos/500/500?1",
    });
    fetchAddresses();
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    setProfileData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddressFormChange = (e) => {
    setAddressForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openNewAddress = () => {
    setAddressForm({
      title: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      postal_code: "",
      country: "",
    });
    setAddressModal("new");
  };

  const openEditAddress = (address) => {
    setAddressForm({
      title: address.title || "",
      address_line_1: address.address_line_1 || "",
      address_line_2: address.address_line_2 || "",
      city: address.city || "",
      postal_code: address.postal_code || "",
      country: address.country || "",
    });
    setAddressModal(address);
  };

  const handleAddressSave = async (e) => {
    e.preventDefault();
    try {
      if (addressModal === "new") {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/addresses`,
          addressForm,
          config,
        );
        toast.success(t("profilePage.address.added", "Address added."));
      } else {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/addresses/${addressModal.id}`,
          addressForm,
          config,
        );
        toast.success(t("profilePage.address.updated", "Address updated."));
      }
      setAddressModal(null);
      fetchAddresses();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving address");
    }
  };

  const handleDeleteAddress = async (id) => {
    if (
      !window.confirm(
        t("profilePage.address.confirmDelete", "Delete this address?"),
      )
    )
      return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/addresses/${id}`,
        config,
      );
      toast.success(t("profilePage.address.deleted", "Address removed."));
      fetchAddresses();
    } catch (error) {
      toast.error("Error deleting address");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const { data: updatedUser } = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/profile/avatar`,
          formData,
          { ...config, headers: { "Content-Type": "multipart/form-data" } },
        );
        setProfileData((prev) => ({ ...prev, avatar: updatedUser.avatar_url }));
        setSelectedFile(null);
      }
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          phone_number: profileData.phone,
          nif: profileData.nif,
        },
        config,
      );
      setIsEditing(false);
      toast.success(t("profilePage.buttons.saveChanges"));
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData((prev) => ({
        ...prev,
        avatar: URL.createObjectURL(file),
      }));
      setSelectedFile(file);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/login");
  };

  const inputStyles = `
    w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm shadow-sm transition
    focus:outline-none focus:ring-2 focus:ring-main-blue focus:border-main-blue
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top actions */}
        <div className="flex w-full justify-end gap-3">
          <Link
            to="/my-orders"
            className="px-6 py-2.5 rounded-lg bg-main-blue text-white font-semibold hover:opacity-90"
          >
            {t("profilePage.buttons.orders")}
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
          >
            {t("profilePage.buttons.logOut")}
          </button>
          <button
            onClick={() => handleDeleteUser(userInfo.id)}
            disabled={loading}
            className="bg-red-500 text-white py-2 px-4 hover:bg-red-600 rounded cursor-pointer"
          >
            {t("userManagement.table.deleteButton")}
          </button>
        </div>

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-main-blue text-white flex items-center justify-center text-2xl font-bold shadow-md">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    {profileData.firstName?.[0]}
                    {profileData.lastName?.[0]}
                  </>
                )}
              </div>
              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-main-blue text-white text-xs px-2 py-1 rounded-full cursor-pointer shadow hover:scale-105 transition">
                  {t("profilePage.buttons.changePhoto")}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-gray-500 text-sm">{profileData.email}</p>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2.5 rounded-lg bg-main-blue text-white font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
            >
              {t("profilePage.buttons.editProfile")}
            </button>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
              {t("profilePage.sections.personalInfo")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.firstName")}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.lastName")}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.email")}
                </label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className={inputStyles}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.phone")}
                </label>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputStyles}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.nif")}
                </label>
                <input
                  type="text"
                  name="nif"
                  value={profileData.nif}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputStyles}
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="sticky bottom-6 bg-white rounded-2xl shadow-lg p-6 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2.5 rounded-lg border border-gray-300 font-medium hover:bg-gray-50 transition"
              >
                {t("profilePage.buttons.cancel")}
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-main-blue text-white font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
              >
                {t("profilePage.buttons.saveChanges")}
              </button>
            </div>
          )}
        </form>

        {/* Addresses */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="flex items-center justify-between border-b pb-3 mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {t("profilePage.sections.address", "Addresses")}
            </h2>
            <button
              onClick={openNewAddress}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-main-blue text-white text-sm font-semibold hover:opacity-90 transition"
            >
              <HiPlus className="text-base" />
              {t("profilePage.address.add", "Add address")}
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">
              {t("profilePage.address.empty", "No addresses saved yet.")}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("profilePage.address.label", "Address")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("profilePage.address.cityCountry", "City / Country")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("profilePage.address.postal", "Postal code")}
                    </th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {addresses.map((address, i) => (
                    <tr
                      key={address.id}
                      className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        <div>{address.address_line_1}</div>
                        {address.address_line_2 && (
                          <div className="text-gray-400 text-xs">
                            {address.address_line_2}
                          </div>
                        )}
                        {address.title && (
                          <span className="inline-block mt-1 text-xs bg-main-blue/10 text-main-blue px-2 py-0.5 rounded-full">
                            {address.title}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {address.city}, {address.country}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {address.postal_code}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditAddress(address)}
                            className="text-main-blue hover:opacity-70 transition"
                            title="Edit"
                          >
                            <HiOutlinePencil className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-500 hover:opacity-70 transition"
                            title="Delete"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
                {t("profilePage.address.showing", "Showing")}{" "}
                <span className="font-medium">{addresses.length}</span>{" "}
                {t("profilePage.address.results", "addresses")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Address Modal */}
      {addressModal !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {addressModal === "new"
                ? t("profilePage.address.newTitle", "New address")
                : t("profilePage.address.editTitle", "Edit address")}
            </h2>
            <form onSubmit={handleAddressSave} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.address.title", "Label (e.g. Home, Work)")}
                </label>
                <input
                  type="text"
                  name="title"
                  value={addressForm.title}
                  onChange={handleAddressFormChange}
                  className={inputStyles}
                  placeholder="Home"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.addressLine1")}
                </label>
                <input
                  type="text"
                  name="address_line_1"
                  value={addressForm.address_line_1}
                  onChange={handleAddressFormChange}
                  required
                  className={inputStyles}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.addressLine2")}
                </label>
                <input
                  type="text"
                  name="address_line_2"
                  value={addressForm.address_line_2}
                  onChange={handleAddressFormChange}
                  className={inputStyles}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("profilePage.fields.city")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFormChange}
                    required
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("profilePage.fields.postalCode")}
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    value={addressForm.postal_code}
                    onChange={handleAddressFormChange}
                    required
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("profilePage.fields.country")}
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressFormChange}
                    required
                    className={inputStyles}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddressModal(null)}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50 transition"
                >
                  {t("profilePage.buttons.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-main-blue text-white text-sm font-semibold hover:opacity-90 transition"
                >
                  {t("profilePage.buttons.saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
