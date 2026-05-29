import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "./PaypalButton";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { clearCart } from "../../redux/slices/cartSlice";

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [showPayment, setShowPayment] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
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
      // Preenche os dados base (Redux) de imediato para não haver delay na interface
      setShippingAddress((prev) => ({
        ...prev,
        firstName: userInfo.first_name || "",
        lastName: userInfo.last_name || "",
        phone: userInfo.phone_number || "",
        nif: userInfo.nif || "",
      }));

      const fetchCheckoutData = async () => {
        try {
          // Vai buscar a morada e os dados frescos do utilizador (para garantir que o NIF não está desatualizado no Redux)
          const [addressRes, userRes] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/addresses`, {
              withCredentials: true,
            }),
            axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
              withCredentials: true,
            }),
          ]);

          const addressData = addressRes.data;
          const freshUser = userRes.data;

          setShippingAddress((prev) => {
            const newState = {
              ...prev,
              firstName: freshUser?.first_name || prev.firstName,
              lastName: freshUser?.last_name || prev.lastName,
              phone: freshUser?.phone_number || prev.phone,
              nif: freshUser?.nif || prev.nif,
            };

            if (addressData && addressData.length > 0) {
              // Mapeia o nome do país vindo da BD para as <options> do teu select ("PT" ou "ES")
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

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (details) => {
    setIsProcessing(true);
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
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    firstName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">
                {t("checkoutPage.form.lastName")}
              </label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    lastName: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("profilePage.fields.nif", "NIF")}
            </label>
            <input
              type="text"
              value={shippingAddress.nif}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  nif: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.address")}
            </label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.address")} {" 2"}
            </label>
            <input
              type="text"
              value={shippingAddress.address2}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  address2: e.target.value,
                })
              }
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
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    city: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">
                {t("checkoutPage.form.postalCode")}
              </label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.country")}
            </label>
            <select
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded bg-white"
              required
            >
              <option value="">
                {t("checkoutPage.form.selectCountry", "Selecione um país")}
              </option>
              <option value="PT">Portugal</option>
              <option value="ES">Espanha</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">
              {t("checkoutPage.form.phone")}
            </label>
            <input
              type="tel"
              value={shippingAddress.phone}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  phone: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mt-6">
            {/* Payment button*/}
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
                    {t(
                      "checkoutPage.payment.processing",
                      "A processar pagamento...",
                    )}
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
