import { useState } from "react";
import { HiMiniArchiveBox } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@email.com",
    phone: "+351 912 345 678",
    addressLine1: "Rua Exemplo 123",
    addressLine2: "Apartment 4B",
    city: "Lisbon",
    postalCode: "1000-001",
    country: "Portugal",
    avatar: "https://picsum.photos/500/500?1",
  });

  const handleChange = (e) => {
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setIsEditing(false);
    console.log("Updated profile:", profileData);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);

      setProfileData((prev) => ({
        ...prev,
        avatar: imageUrl,
      }));
    }
  };

  const handleLogout = () => {
    console.log("User logged out");
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
            <h2>Orders</h2>
          </Link>

          <button
            onClick={handleLogout}
            className="px-6 py-2.5 rounded-lg bg-red-500 text-white font-semibold shadow hover:bg-red-600 transition cursor-pointer"
          >
            Log Out
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
                  />
                ) : (
                  <>
                    {profileData.firstName[0]}
                    {profileData.lastName[0]}
                  </>
                )}
              </div>

              {isEditing && (
                <label className="absolute -bottom-2 -right-2 bg-main-blue text-white text-xs px-2 py-1 rounded-full cursor-pointer shadow hover:scale-105 transition">
                  Change
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
              Edit Profile
            </button>
          )}
        </div>

        <form onSubmit={handleUpdate} className="space-y-8">
          {/* Personal Info */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  First Name
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
                  Last Name
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
                  Email
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
                  Phone Number
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
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-3">
              Address
            </h2>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Address Line 1
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
                  Address Line 2
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
                    City
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
                    Postal Code
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
                    Country
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
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-main-blue text-white font-semibold shadow hover:shadow-lg hover:scale-[1.02] transition"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
