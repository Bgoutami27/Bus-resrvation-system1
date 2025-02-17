import React from "react";
import Checkout from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import styled from "styled-components";
import { Buses } from "./index";

// Load Stripe (Move to env variable in production)
const stripePromise = loadStripe("pk_test_51Qr12CC8DBNIddQPlIUNsFsUwml7IzAwEmjYBo3UIX5QqC7isK9IjPP8SlTiqIvviBMWbhmkW2cFBFc46xpbGJBn006sw8BqbE");

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  padding: 20px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.4);
  text-align: center;
`;

const Payment = ({ searchState, selectedSeats }) => {
  if (!searchState || !selectedSeats.length) {
    return <p>Error: Missing search details or selected seats.</p>;
  }

  // Find selected bus based on route
  const selectedBus = Buses.find(
    (bus) => bus.source === searchState.from && bus.destination === searchState.to
  );

  if (!selectedBus) {
    return <p>No buses available for the selected route.</p>;
  }

  // Parse fare per seat
  const pricePerSeat = parseInt(selectedBus.price.replace(/[₹,]/g, ""), 10);
  const totalAmount = selectedSeats.length * pricePerSeat;

  return (
    <Container>
      <h2>Payment Details</h2>
      <p><strong>Bus:</strong> {selectedBus.source} → {selectedBus.destination}</p>
      <p><strong>Fare per seat:</strong> ₹{pricePerSeat}</p>
      <p><strong>Selected Seats:</strong> {selectedSeats.length}</p>
      <h3><strong>Total Amount:</strong> ₹{totalAmount}</h3>

      <Elements stripe={stripePromise}>
        <Checkout totalAmount={totalAmount} />
      </Elements>
    </Container>
  );
};

export default Payment;