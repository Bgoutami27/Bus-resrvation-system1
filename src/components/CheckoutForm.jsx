import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Button } from "react-bootstrap";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  background: #fff;
`;

const Checkout = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    // Simulate server response (Replace with actual backend API)
    setTimeout(() => {
      setLoading(false);
      alert("✅ Payment Successful!");
      navigate("/");
    }, 2000);
  };

  return (
    <Container>
      <h3>Enter Payment Details</h3>
      <form onSubmit={handlePayment}>
        <CardElement className="form-control mb-3" />
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
        <Button type="submit" variant="success" disabled={loading || !stripe}>
          {loading ? "Processing..." : `Pay ₹${totalAmount || 0}`}
        </Button>
      </form>
    </Container>
  );
};

export default Checkout;
