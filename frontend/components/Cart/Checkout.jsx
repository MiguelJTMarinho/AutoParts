import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "./PaypalButton";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { clearCart } from "../../redux/slices/cartSlice";

const validateNIF = (nif) => /^\d{9}$/.test(nif);
const validatePhone = (phone) => /^\+?[\d\s\-]{9,15}$/.test(phone);
const validatePostalCode = (code, country) => {
  if (country === "PT") return /^\d{4}-\d{3}$/.test(code);
  if (country === "ES") return /^\d{5}$/.test(code);
  return code.length > 0;
};

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    nif: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [saveAddress, setSaveAddress] = useState(false);

  const cartItems = cart?.items || cart?.products || [];
  const cartTotal =
    cart?.total ||
    cartItems.reduce(
      (acc, item) =>
        acc + Number(item.price_at_time || item.price || 0) * item.quantity,
      0,
    );

  const shippingPrice = cart.shipping_price;
  const grandTotal = cartTotal + shippingPrice;

  useEffect(() => {
    if (userInfo) {
      setShippingAddress((prev) => ({
        ...prev,
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        phone: userInfo.phone_number || "",
        nif: userInfo.nif || "",
      }));

      const fetchCheckoutData = async () => {
        try {
          const [addressRes, userRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/addresses`, {
              withCredentials: true,
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
              withCredentials: true,
            }),
          ]);

          const addressData = addressRes.data || [];
          setAddresses(addressData);
          const freshUser = userRes.data;

          setShippingAddress((prev) => {
            const newState = {
              ...prev,
              firstName: freshUser?.first_name || prev.firstName,
              lastName: freshUser?.last_name || prev.lastName,
              phone: freshUser?.phone_number || prev.phone,
              nif: freshUser?.nif || prev.nif,
            };

            if (addressData.length > 0) {
              setSelectedAddressId(addressData[0].id);
              let fetchedCountry = addressData[0].country || "";
              const lowerCountry = fetchedCountry.toLowerCase().trim();
              if (lowerCountry === "portugal" || lowerCountry === "pt")
                fetchedCountry = "PT";
              else if (
                lowerCountry === "espanha" ||
                lowerCountry === "spain" ||
                lowerCountry === "es"
              )
                fetchedCountry = "ES";

              newState.address = addressData[0].address_line_1 || "";
              newState.address2 = addressData[0].address_line_2 || "";
              newState.city = addressData[0].city || "";
              newState.postalCode = addressData[0].postal_code || "";
              newState.country = fetchedCountry;
            }

            return newState;
          });
        } catch (error) {
          console.error("Failed to fetch checkout data", error);
        }
      };
      fetchCheckoutData();
    }
  }, [userInfo]);

  const handleAddressSelect = (addressId) => {
    if (!addressId) {
      setSelectedAddressId("");
      setShippingAddress((prev) => ({
        ...prev,
        address: "",
        address2: "",
        city: "",
        postalCode: "",
        country: "",
      }));
      return;
    }

    const address = addresses.find((a) => a.id === Number(addressId));
    if (!address) return;

    let country = address.country || "";
    if (country.toLowerCase() === "portugal") country = "PT";
    else if (
      country.toLowerCase() === "espanha" ||
      country.toLowerCase() === "spain"
    )
      country = "ES";

    setSelectedAddressId(address.id);
    setShippingAddress((prev) => ({
      ...prev,
      address: address.address_line_1 || "",
      address2: address.address_line_2 || "",
      city: address.city || "",
      postalCode: address.postal_code || "",
      country,
    }));
  };

const validate = () => {
    const newErrors = {};

    if (!/^[a-zA-ZÀ-ÿ\s\-']{2,}$/.test(shippingAddress.firstName))
      newErrors.firstName = t("checkoutPage.validation.firstName", "Invalid first name (minimum 2 letters)");

    if (!/^[a-zA-ZÀ-ÿ\s\-']{2,}$/.test(shippingAddress.lastName))
      newErrors.lastName = t("checkoutPage.validation.lastName", "Invalid last name (minimum 2 letters)");

    if (shippingAddress.nif && !validateNIF(shippingAddress.nif))
      newErrors.nif = t("checkoutPage.validation.nif", "Invalid NIF (9 digits)");

    if (!shippingAddress.address.trim())
      newErrors.address = t("checkoutPage.validation.address", "Address is required");

    if (!/^[a-zA-ZÀ-ÿ\s]{2,}$/.test(shippingAddress.city))
      newErrors.city = t("checkoutPage.validation.city", "Invalid city");

    if (!shippingAddress.country)
      newErrors.country = t("checkoutPage.validation.country", "Country is required");

    if (!validatePostalCode(shippingAddress.postalCode, shippingAddress.country))
      newErrors.postalCode =
        shippingAddress.country === "PT"
          ? t("checkoutPage.validation.postalCodePT", "Invalid postal code (e.g., 1234-567)")
          : shippingAddress.country === "ES"
          ? t("checkoutPage.validation.postalCodeES", "Invalid postal code (e.g., 28001)")
          : t("checkoutPage.validation.postalCodeDefault", "Invalid postal code");

    if (!validatePhone(shippingAddress.phone))
      newErrors.phone = t("checkoutPage.validation.phone", "Invalid phone number");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    if (validate()) setShowPayment(true);
  };

  const handlePaymentSuccess = async (details) => {
    setIsProcessing(true);
    if (!selectedAddressId && saveAddress) {
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/addresses`,
          {
            title: "Checkout",
            address_line_1: shippingAddress.address,
            address_line_2: shippingAddress.address2,
            city: shippingAddress.city,
            postal_code: shippingAddress.postalCode,
            country: shippingAddress.country,
          },
          { withCredentials: true },
        );
      } catch (error) {
        console.error("Failed to save address", error);
      }
    }
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/checkout`,
        {
          paypal_order_id: details.id,
          shipping_method: "Standard",
          name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
          email: userInfo?.email,
          nif: shippingAddress.nif,
          phone_number: shippingAddress.phone,
          address_line_1: shippingAddress.address,
          address_line_2: shippingAddress.address2,
          city: shippingAddress.city,
          postal_code: shippingAddress.postalCode,
          country: shippingAddress.country,
        },
        { withCredentials: true },
      );
      toast.success(
        t("checkoutPage.alerts.paymentSuccess", "Payment successful!"),
      );
      const orderId = Array.isArray(data)
        ? data[0]?.id
        : data.id || data.order_id || "";
      dispatch(clearCart());
      navigate(`/order-confirmation?orderId=${orderId}`);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.error || t("checkoutPage.alerts.paymentFailed"),
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-20 px-6 text-center">
        <h2 className="text-2xl font-bold mb-4">{t("checkoutPage.title")}</h2>
        <p className="text-gray-500">{t("cartDrawer.emptyCart")}</p>
      </div>
    );
  }

  const fieldClass = (field) =>
    `w-full p-2 border rounded ${errors[field] ? "border-red-500" : ""}`;

  const ErrorMsg = ({ field }) =>
    errors[field] ? (
      <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
    ) : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6 tracking-tighter">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl uppercase mb-6">{t("checkoutPage.title")}</h2>
        <form onSubmit={handleCreateCheckout}>
          <h3 className="text-lg mb-4">
            {t("checkoutPage.sections.contactDetails")}
          </h3>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.email")}
            </label>
            <input
              type="email"
              value={userInfo?.email || ""}
              className="w-full p-2 border rounded bg-gray-200"
              disabled
            />
          </div>
          <h3 className="text-lg mb-4">
            {t("checkoutPage.sections.delivery")}
          </h3>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">
                {t("checkoutPage.form.firstName")}
              </label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, "");
                  setShippingAddress({ ...shippingAddress, firstName: val });
                }}
                className={fieldClass("firstName")}
                required
              />
              <ErrorMsg field="firstName" />
            </div>
            <div>
              <label className="block text-gray-700">
                {t("checkoutPage.form.lastName")}
              </label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s\-']/g, "");
                  setShippingAddress({ ...shippingAddress, lastName: val });
                }}
                className={fieldClass("lastName")}
                required
              />
              <ErrorMsg field="lastName" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("profilePage.fields.nif", "NIF")}
            </label>
            <input
              type="text"
              value={shippingAddress.nif}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "").slice(0, 9);
                setShippingAddress({ ...shippingAddress, nif: val });
              }}
              className={fieldClass("nif")}
              maxLength={9}
            />
            <ErrorMsg field="nif" />
          </div>
          {addresses.length > 0 && (
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">
                Moradas guardadas
              </label>
              <select
                value={selectedAddressId}
                onChange={(e) => handleAddressSelect(e.target.value)}
                className="w-full p-2 border rounded bg-white"
              >
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.title
                      ? `${address.title} - ${address.address_line_1}`
                      : address.address_line_1}
                  </option>
                ))}
                <option value="">Nova morada</option>
              </select>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.address")}
            </label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) => {
                setShippingAddress({ ...shippingAddress, address: e.target.value });
                setSelectedAddressId("");
              }}
              className={fieldClass("address")}
              required
            />
            <ErrorMsg field="address" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.address")} {" 2"}
            </label>
            <input
              type="text"
              value={shippingAddress.address2}
              onChange={(e) => {
                setShippingAddress({ ...shippingAddress, address2: e.target.value });
                setSelectedAddressId("");
              }}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">
                {t("checkoutPage.form.city")}
              </label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, "");
                  setShippingAddress({ ...shippingAddress, city: val });
                  setSelectedAddressId("");
                }}
                className={fieldClass("city")}
                required
              />
              <ErrorMsg field="city" />
            </div>
            <div>
              <label className="block text-gray-700">
                {t("checkoutPage.form.postalCode")}
              </label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) => {
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value });
                  setSelectedAddressId("");
                }}
                className={fieldClass("postalCode")}
                required
              />
              <ErrorMsg field="postalCode" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.country")}
            </label>
            <select
              value={shippingAddress.country}
              onChange={(e) => {
                setShippingAddress({ ...shippingAddress, country: e.target.value });
                setSelectedAddressId("");
              }}
              className={`w-full p-2 border rounded bg-white ${errors.country ? "border-red-500" : ""}`}
              required
            >
              <option value="">
                {t("checkoutPage.form.selectCountry", "Selecione um país")}
              </option>
              <option value="PT">Portugal</option>
              <option value="ES">Espanha</option>
            </select>
            <ErrorMsg field="country" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.phone")}
            </label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d\s\+\-]/g, "");
                setShippingAddress({ ...shippingAddress, phone: val });
              }}
              className={fieldClass("phone")}
              required
            />
            <ErrorMsg field="phone" />
          </div>
          {!selectedAddressId && (
            <div className="mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                />
                Guardar esta morada para futuras compras
              </label>
            </div>
          )}
          <div className="mt-6">
            {!showPayment ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
                disabled={isProcessing}
              >
                {t("checkoutPage.buttons.continuePayment")}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">
                  {t("checkoutPage.payment.title")}
                </h3>
                {isProcessing ? (
                  <div className="text-center py-4 font-medium text-gray-600">
                    {t("checkoutPage.payment.processing", "A processar pagamento...")}
                  </div>
                ) : (
                  <PaypalButton
                    amount={grandTotal.toString()}
                    onSuccess={handlePaymentSuccess}
                    onError={(err) =>
                      toast.error(t("checkoutPage.alerts.paymentFailed"))
                    }
                  />
                )}
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">
          {t("checkoutPage.sections.orderSummary")}
        </h3>
        <div className="border-t py-4 mb-4">
          {cartItems.map((item, index) => {
            const imgUrl =
              item.image_url ||
              item.image ||
              item.product?.images?.[0]?.image_url ||
              "https://placehold.co/200x240?text=No+Image";
            return (
              <div
                key={item.id || index}
                className="flex items-start justify-between py-2 border-b"
              >
                <div className="flex items-start">
                  <img
                    src={imgUrl}
                    alt={item.product?.name || item.name}
                    className="w-20 h-24 object-cover mr-4 rounded-md"
                  />
                  <div>
                    <h3 className="text-md font-medium">
                      {item.product?.name || item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {t("checkoutPage.form.quantity", "Qtd")}: {item.quantity}
                    </p>
                  </div>
                </div>
                <p className="text-lg font-semibold">
                  €{Number(item.price_at_time || item.price || 0).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>{t("checkoutPage.summary.subtotal")}</p>
          <p>€{cartTotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>{t("checkoutPage.summary.shipping")}</p>
          <p className={shippingPrice === 0 ? "text-green-600" : ""}>
            {shippingPrice === 0
              ? t("checkoutPage.summary.shippingFree")
              : `€${shippingPrice.toFixed(2)}`}
          </p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>{t("checkoutPage.summary.total")}</p>
          <p>€{grandTotal.toFixed(2)}</p>
        </div>
        <div className="flex justify-end">
          <p className="text-xs text-gray-500">{t("productGrid.VAT")}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;