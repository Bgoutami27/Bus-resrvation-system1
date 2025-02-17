import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/Header";
import BusSearch from "./components/BusSearch";
import BusLayout from "./components/BusLayout";
import { locations } from "./utils/index";
import BookingForm from "./components/BookingForm";
import Payment from "./components/Payment";
import Login from "./components/Login"; // ✅ Import Login Component

function App() {
  const [searchState, setSearchState] = useState({
    from: locations.length > 0 ? locations[0] : "",
    to: locations.length > 2 ? locations[2] : "",
    date: "",
  });

  const [selectedSeats, setSelectedSeats] = useState([]);

  return (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route
          path="/"
          element={
            <BusSearch
              searchState={searchState}
              setSearchState={setSearchState}
            />
          }
        />
        <Route
          path="/bus/:id"
          element={
            <BusLayout
              selectedSeats={selectedSeats}
              setSelectedSeats={setSelectedSeats}
            />
          }
        />
        <Route
          path="/bus/book"
          element={
            <BookingForm
              selectedSeats={selectedSeats}
              searchState={searchState}
            />
          }
        />
        <Route
          path="/bus/payment"
          element={
            <Payment selectedSeats={selectedSeats} searchState={searchState} />
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
