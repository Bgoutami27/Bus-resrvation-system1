import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Buses } from "../utils/index";
import Login from "../components/Login"; // ✅ Fix Import (Ensure it's a default export)

const Container = styled.div`
  background-color: #f0f0f0;
  padding: 1rem;
  border-radius: 5px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`;

const TicketContainer = styled.div`
  padding: 0.5rem;
`;

const TicketItem = styled.li`
  list-style-type: none;
  margin: 0.5rem;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: ${(props) => props.width || "80px"};
  cursor: ${(props) => (props.$isAvailable ? "pointer" : "not-allowed")};
  background-color: ${(props) =>
    props.$isSelected
      ? "#318beb"
      : props.$isAvailable
      ? "#fff"
      : "#b6b4b4"};
  color: ${(props) => (props.$isSelected ? "white" : "black")};
`;

export default function BusLayout({ selectedSeats, setSelectedSeats }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const selectedBus = Buses.find((bus) => bus.id === parseInt(id));

  useEffect(() => {
    setSelectedSeats([]);
  }, [id, setSelectedSeats]);

  if (!selectedBus) {
    return <h3>Bus not found for ID {id}</h3>;
  }

  const isSleeper = selectedBus.busType.toLowerCase() === "sleeper";
  const seatWidth = isSleeper ? "80px" : "25px";

  const isSeatAvailable = (seat) => selectedBus.availableSeats.includes(seat);
  const isSeatSelected = (seat) => selectedSeats.includes(seat);

  const selectSeats = (seat) => {
    if (!isSeatAvailable(seat)) return;
    if (isSeatSelected(seat)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seat));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const generateSeats = (array, keyPrefix = "") => {
    if (!array || !Array.isArray(array)) {
      console.warn("Invalid seat data:", array);
      return null;
    }

    return (
      <div className="d-flex flex-column">
        {array.map((seats, rowIndex) => (
          <div key={rowIndex} className="d-flex">
            {Array.isArray(seats) &&
              seats.map((seat, subIndex) => {
                const seatId = `${keyPrefix}${seat}`;
                return (
                  <TicketItem
                    key={`${seatId}-${rowIndex}-${subIndex}`}
                    width={seatWidth}
                    $isAvailable={isSeatAvailable(seatId)}
                    $isSelected={isSeatSelected(seatId)}
                    onClick={() => selectSeats(seatId)}
                  >
                    {seatId}
                  </TicketItem>
                );
              })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Container>
      <h2>{selectedBus.name}</h2>
      <h4>Tickets</h4>
      <h5>{selectedBus.busType}</h5>

      <div className="d-flex">
        <div className="d-flex ms-2 align-items-center">
          <h6>Available</h6>
          <TicketItem width={seatWidth} style={{ background: "#fff" }}>
            1
          </TicketItem>
        </div>
        <div className="d-flex ms-2 align-items-center">
          <h6>Booked</h6>
          <TicketItem width={seatWidth} style={{ background: "#b6b4b4" }}>
            1
          </TicketItem>
        </div>
        <div className="d-flex ms-2 align-items-center">
          <h6>Selected</h6>
          <TicketItem width={seatWidth} style={{ background: "#318beb", color: "white" }}>
            1
          </TicketItem>
        </div>
      </div>

      <div className="d-flex flex-wrap">
        {isSleeper && selectedBus.seatLayout.upper && (
          <TicketContainer className="d-flex align-items-center">
            <h6 className="p-3">Upper</h6>
            <div className="d-flex flex-wrap">
              {generateSeats(selectedBus.seatLayout.upper.first, "U")}
              <div className="d-flex mt-4">
                {generateSeats(selectedBus.seatLayout.upper.second, "U")}
              </div>
            </div>
          </TicketContainer>
        )}
        {isSleeper && selectedBus.seatLayout.lower && (
          <TicketContainer className="d-flex align-items-center">
            <h6 className="p-3">Lower</h6>
            <div className="d-flex flex-wrap">
              {generateSeats(selectedBus.seatLayout.lower.first, "L")}
              <div className="d-flex mt-4">
                {generateSeats(selectedBus.seatLayout.lower.second, "L")}
              </div>
            </div>
          </TicketContainer>
        )}
        {selectedBus.seatLayout.first && (
          <TicketContainer className="d-flex align-items-center">
            <h6 className="p-3">Seater</h6>
            <div className="d-flex flex-wrap">
              {generateSeats(selectedBus.seatLayout.first)}
              <div className="d-flex mt-4">
                {generateSeats(selectedBus.seatLayout.second)}
              </div>
            </div>
          </TicketContainer>
        )}
      </div>

      <div className="d-flex justify-content-center">
        {selectedSeats.length > 0 && <h4>Selected Seats: {selectedSeats.join(", ")}</h4>}
      </div>

      {/* Booking Button */}
      <button
        className="ms-3 btn btn-success"
        onClick={() => navigate("/bus/book")}
        disabled={selectedSeats.length === 0}
      >
        Book Now
      </button>

      {/* 🚀 NEW LOGIN BUTTON */}
      
    </Container>
  );
}
