import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PaypalButton from "./PaypalButton";
import { useTranslation } from "react-i18next";

const cart = {
  products: [
    {
      product: 1,
      name: "RIDEX 854S0720 Amortecedor para FORD FOCUS, C-MAX",
      category: "Suspension",
      make: "Ford",
      model: "Focus",
      quantity: "1",
      price: "50",
      image: "https://picsum.photos/200?random=1",
    },
    {
      product: 2,
      name: "Amortecedor para FORD Fiesta, C-MAX",
      category: "Suspension",
      make: "Ford",
      model: "Fiesta",
      quantity: "1",
      price: "45",
      image: "https://picsum.photos/200?random=2",
    },
  ],
  totalprice: 195,
};

const Checkout = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState();
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleCreateCheckout = (e) => {
    e.preventDefault();
    setCheckoutId(123);
  };

  const handlePaymentSuccess = (details) => {
    console.log("Payment Successful", details);
    navigate("/order-confirmation");
  };

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
              value="user@example.com"
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
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className="w-full p-2 border rounded"
              required
            />
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
            {!checkoutId ? (
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded"
              >
                {t("checkoutPage.buttons.continuePayment")}
              </button>
            ) : (
              <div>
                <h3 className="text-lg mb-4">
                  {t("checkoutPage.payment.title")}
                </h3>
                <PaypalButton
                  amount={"100"}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) =>
                    alert(t("checkoutPage.alerts.paymentFailed"))
                  }
                />
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
          {cart.products.map((product, index) => (
            <div
              key={index}
              className="flex items-start justify-between py-2 border-b"
            >
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-24 object-cover mr-4"
                />
                <div>
                  <h3 className="text-md">{product.name}</h3>
                  <p className="text-gray-500">
                    {product.make} {product.model}
                  </p>
                  <p className="text-gray-500">{product.category}</p>
                </div>
              </div>
              <p className="text-xl">€{product.price}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>{t("checkoutPage.summary.subtotal")}</p>
          <p>€{cart.totalprice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>{t("checkoutPage.summary.shipping")}</p>
          <p className="text-green-600">
            {t("checkoutPage.summary.shippingFree")}
          </p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4">
          <p>{t("checkoutPage.summary.total")}</p>
          <p>€{cart.totalprice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
