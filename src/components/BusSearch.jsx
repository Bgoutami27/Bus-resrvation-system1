import React, { useState } from "react";
import styled from "styled-components";
import { locations, Buses } from "./index";
import { Button, Spinner } from "react-bootstrap";
import BusList from "./BusList";
import { FaExchangeAlt } from "react-icons/fa"; 
import MapComponent from "./MapComponent"; // Import MapComponent

const Container = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.4);
  text-align: center;
  width: 80%;
  max-width: 800px;
  margin: auto;
`;

const SelectWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export default function BusSearch({ searchState, setSearchState }) {
  const [filteredBus, setFilteredBus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = () => {
    if (!searchState.from || !searchState.to || !searchState.date) {
      alert("⚠ Please select From, To, and Date before searching!");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const results = Buses.filter(
        (bus) =>
          bus.source.toLowerCase() === searchState.from.toLowerCase() &&
          bus.destination.toLowerCase() === searchState.to.toLowerCase() &&
          bus.availableDates.includes(searchState.date)
      );

      setFilteredBus(results.length > 0 ? results : []);
      setLoading(false);
    }, 1000);
  };

  // Swap From and To Locations
  const swapLocations = () => {
    setSearchState((prevState) => ({
      ...prevState,
      from: prevState.to,
      to: prevState.from,
    }));
  };

  return (
    <Container>
      <h2 className="mb-3">Search For Buses</h2>
      <div className="d-flex flex-column align-items-center">
        <SelectWrapper>
          <select
            className="mb-3 form-select w-75"
            value={searchState.from || ""}
            onChange={(e) =>
              setSearchState((prevState) => ({
                ...prevState,
                from: e.target.value,
              }))
            }
          >
            <option value="">Select Departure</option>
            {locations.map((location) => (
              <option key={`${location}-from`} value={location}>
                {location}
              </option>
            ))}
          </select>

          <FaExchangeAlt
            style={{ fontSize: "24px", margin: "0 10px", cursor: "pointer" }}
            onClick={swapLocations}
          />

          <select
            className="mb-3 form-select w-75"
            value={searchState.to || ""}
            onChange={(e) =>
              setSearchState((prevState) => ({
                ...prevState,
                to: e.target.value,
              }))
            }
          >
            <option value="">Select Destination</option>
            {locations.map((location) => (
              <option key={`${location}-destination`} value={location}>
                {location}
              </option>
            ))}
          </select>
        </SelectWrapper>

        <input
          className="form-control mb-3"
          type="date"
          value={searchState.date || ""}
          onChange={(e) =>
            setSearchState((prevState) => ({
              ...prevState,
              date: e.target.value,
            }))
          }
        />
      </div>

      <Button
        variant="primary"
        className="mb-3"
        onClick={handleSearch}
        disabled={!searchState.from || !searchState.to || !searchState.date}
      >
        Search
      </Button>

      {loading && <Spinner animation="border" variant="primary" />}

      {!loading && filteredBus !== null && (
        filteredBus.length > 0 ? (
          <BusList buses={filteredBus} />
        ) : (
          <h3>❌ No Buses Found</h3>
        )
      )}

      {/* Add Map Below Search Inputs */}
      <h3 className="mt-4">Available Locations</h3>
      <MapComponent />
    </Container>
  );
}
