import {
  PayPalProvider,
  PayPalOneTimePaymentButton,
} from "@paypal/react-paypal-js/sdk-v6";

const PaypalButton = ({ amount, onSuccess, onError }) => {
  return (
    <PayPalProvider clientId="AciBd3jBz2-vAxEJOGYYw6ZGym7_1xrclmM3oOywW_ylIo6II7-tLsE6QKr6egcqTmgvD7g5SR0mO__G">
      <PayPalOneTimePaymentButton
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.createOrder({
            purchase_units: [{ amount: { value: amount } }],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.caputre().then(onSuccess);
        }}
        onError={onError}
      />
    </PayPalProvider>
  );
};

export default PaypalButton;
