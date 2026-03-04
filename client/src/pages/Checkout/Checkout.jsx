import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate, useSearchParams } from "react-router-dom";
import { makeRequest } from "../../makeRequest";
import { resetCart } from "../../redux/cartReducer";
import "./Checkout.scss";

const Checkout = () => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const checkoutMode = process.env.REACT_APP_CHECKOUT_MODE || "stripe";

  const stripePublicKey =
    process.env.REACT_APP_STRIPE_PUBLIC_KEY ||
    "pk_test_eOTMlr8usx1ctymXqrik0ls700lQCsX2UB";

  const total = products
    .reduce((acc, item) => acc + Number(item.price || 0) * Number(item.quantity || 1), 0)
    .toFixed(2);

  const handleCheckout = async () => {
    if (!products.length) return;
    try {
      const res = await makeRequest.post("/orders", { products });

      if (checkoutMode === "mock") {
        navigate("/checkout?status=success");
        return;
      }

      const session = res?.data?.stripeSession;

      // Most reliable: redirect directly to Stripe-hosted checkout URL.
      if (session?.url) {
        window.location.href = session.url;
        return;
      }

      // Fallback path for older session responses.
      const stripe = await loadStripe(stripePublicKey);
      const result = await stripe.redirectToCheckout({
        sessionId: session?.id,
      });

      if (result?.error) {
        console.error("Stripe redirect error:", result.error.message);
      }
    } catch (err) {
      console.error("Checkout failed:", err);
    }
  };

  return (
    <div className="checkoutPage">
      <h1>Checkout</h1>

      {status === "success" && (
        <div className="notice success">
          Payment successful. Thank you for your order.
          <button onClick={() => dispatch(resetCart())}>Clear Cart</button>
        </div>
      )}

      {status === "cancel" && (
        <div className="notice cancel">
          Payment canceled. Your cart is still available.
        </div>
      )}

      <div className="checkoutCard">
        <h2>Order Summary</h2>
        <div className="testCardInfo">
          <h3>Stripe Test Card</h3>
          <p>Card Number: 4242 4242 4242 4242</p>
          <p>Expiry: any future date (for example 12/34)</p>
          <p>CVC: any 3 digits (for example 123)</p>
          <p>ZIP/Postal: any valid value</p>
        </div>
        {products.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            {products.map((item) => (
              <div className="row" key={item.id}>
                <span>
                  {item.title} x {item.quantity}
                </span>
                <span>${(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
            <div className="total">
              <span>Total</span>
              <span>${total}</span>
            </div>
            <button className="payBtn" onClick={handleCheckout}>
              {checkoutMode === "mock" ? "Simulate Payment" : "Pay with Stripe"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
