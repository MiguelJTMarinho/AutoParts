import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  console.log("Amount:", amount);
  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AciBd3jBz2-vAxEJOGYYw6ZGym7_1xrclmM3oOywW_ylIo6II7-tLsE6QKr6egcqTmgvD7g5SR0mO__G",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              { currency_mode: "EUR", amount: { value: amount.toString() } },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
