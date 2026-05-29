import { useState, useEffect } from "react";
import { HiMiniArchiveBox } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import axios from "axios";
import { toast } from "sonner";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nif: "",
    addressId: null,
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "",
    avatar: "https://picsum.photos/500/500?1",
  });

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      setProfileData((prev) => ({
        ...prev,
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        email: userInfo.email || "",
        phone: userInfo.phone_number || "",
        nif: userInfo.nif || "",
        avatar: userInfo.avatar_url || "https://picsum.photos/500/500?1",
      }));

      // Carregar moradas do utilizador a partir da API
      const fetchAddresses = async () => {
        try {
          const config = {
            withCredentials: true,
          };
          const { data } = await axios.get(
            `${import.meta.env.VITE_API_URL}/addresses`,
            config,
          );

          if (data && data.length > 0) {
            const primary = data[0]; // Carrega a primeira morada guardada
            setProfileData((prev) => ({
              ...prev,
              addressId: primary.id,
              addressLine1: primary.address_line_1 || "",
              addressLine2: primary.address_line_2 || "",
              city: primary.city || "",
              postalCode: primary.postal_code || "",
              country: primary.country || "",
            }));
          }
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
        }
      };
      fetchAddresses();
    }
  }, [userInfo, navigate]);

  const handleChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const config = {
        withCredentials: true,
      };

      // 0. Upload Avatar (Se houver novo ficheiro)
      if (selectedFile) {
        const formData = new FormData();
        formData.append("image", selectedFile);
        const { data: updatedUser } = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/profile/avatar`,
          formData,
          {
            ...config,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        // Atualiza para a imagem oficial vinda do Cloudinary
        setProfileData((prev) => ({ ...prev, avatar: updatedUser.avatar_url }));
        setSelectedFile(null);
      }

      // 1. Atualizar informações pessoais
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

      // 2. Payload da Morada
      const addressPayload = {
        title: "Primary",
        address_line_1: profileData.addressLine1,
        address_line_2: profileData.addressLine2,
        city: profileData.city,
        postal_code: profileData.postalCode,
        country: profileData.country,
      };

      // 3. Verifica se tem ID de morada para atualizar(PUT) ou se cria uma nova (POST)
      if (profileData.addressId) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/addresses/${profileData.addressId}`,
          addressPayload,
          config,
        );
      } else if (profileData.addressLine1) {
        // Só cria se houver pelo menos a linha 1 preenchida
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/addresses`,
          addressPayload,
          config,
        );
        setProfileData((prev) => ({ ...prev, addressId: data.id }));
      }

      setIsEditing(false);
      toast.success(t("profilePage.buttons.saveChanges"));
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error(error.response?.data?.message || "Error updating profile");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setProfileData((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));
      setSelectedFile(file);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
    dispatch(clearCart());
  };

  const inputStyles = `
    w-full rounded-lg border border-gray-200 bg-white px-4 py-3
    text-sm shadow-sm transition
    focus:outline-none focus:ring-2 focus:ring-main-blue focus:border-main-blue
    disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
  `;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex w-full justify-end">
          <Link
            to="/my-orders"
            className="mr-4 px-6 py-2.5 rounded-lg bg-main-blue text-white font-semibold hover:opacity-90 cursor-pointer"
          >
            <h2>{t("profilePage.buttons.orders")}</h2>
          </Link>

          <button
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition cursor-pointer"
          >
            {t("profilePage.buttons.logOut")}
          </button>
        </div>
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-md p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Avatar + Name */}
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
                    {profileData.firstName?.[0] || ""}
                    {profileData.lastName?.[0] || ""}
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

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
              {t("profilePage.sections.address")}
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.addressLine1")}
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={profileData.addressLine1}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputStyles}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  {t("profilePage.fields.addressLine2")}
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={profileData.addressLine2}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={inputStyles}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("profilePage.fields.city")}
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={profileData.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {t("profilePage.fields.postalCode")}
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={profileData.postalCode}
                    onChange={handleChange}
                    disabled={!isEditing}
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
                    value={profileData.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={inputStyles}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
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
      </div>
    </div>
  );
};

export default Profile;
