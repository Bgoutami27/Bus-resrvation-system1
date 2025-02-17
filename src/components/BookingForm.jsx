import React, { useState } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function BookingForm({ searchState, selectedSeats }) {
  const navigate = useNavigate();
  const [passengerData, setPassengerData] = useState(
    selectedSeats.map((_, index) =>
      index === 0
        ? { idType: "", id: "", name: "", age: "", gender: "", phone: "" }
        : { name: "", age: "", gender: "" }
    )
  );
  const [errors, setErrors] = useState({});

  const handleChange = (index, field, value) => {
    const updatedData = [...passengerData];
    updatedData[index][field] = value;
    setPassengerData(updatedData);
    validateSingleField(index, field, value);
  };

  const validateSingleField = (index, field, value) => {
    let newErrors = { ...errors };

    if (field === "name" && !/^[A-Za-z ]{3,}$/.test(value)) {
      newErrors[index] = { ...newErrors[index], name: "Enter a valid name (min 3 letters)." };
    } else if (field === "age" && (!/^[0-9]+$/.test(value) || value < 1 || value > 120)) {
      newErrors[index] = { ...newErrors[index], age: "Enter a valid age (1-120)." };
    } else if (field === "phone" && index === 0 && !/^\d{10}$/.test(value)) {
      newErrors[index] = { ...newErrors[index], phone: "Enter a valid 10-digit phone number." };
    } else if (field === "gender" && !value) {
      newErrors[index] = { ...newErrors[index], gender: "Select a gender." };
    } else if (field === "id" && index === 0 && value.trim().length < 5) {
      newErrors[index] = { ...newErrors[index], id: "Enter a valid ID number." };
    } else {
      delete newErrors[index]?.[field];
      if (Object.keys(newErrors[index] || {}).length === 0) delete newErrors[index];
    }
    setErrors(newErrors);
  };

  const validateForm = () => {
    let newErrors = {};
    passengerData.forEach((passenger, index) => {
      ["name", "age", "gender"].forEach((field) => {
        if (!passenger[field]) {
          newErrors[index] = { ...newErrors[index], [field]: "This field is required." };
        }
      });
      if (index === 0) {
        if (!passenger.phone || !/^\d{10}$/.test(passenger.phone)) {
          newErrors[index] = { ...newErrors[index], phone: "Enter a valid phone number." };
        }
        if (!passenger.idType) {
          newErrors[index] = { ...newErrors[index], idType: "Select an ID type." };
        }
        if (!passenger.id || passenger.id.trim().length < 5) {
          newErrors[index] = { ...newErrors[index], id: "Enter a valid ID number." };
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateForm()) return;
    navigate("/bus/payment");
  };

  return (
    <div className="text-center">
      <h5>{searchState.from} To {searchState.to}</h5>
      <h5>Date: {searchState.date}</h5>
      <br />
      <h5>Please fill in the details below:</h5>
      {selectedSeats.map((seat, index) => (
        <div key={seat}>
          <div className="my-3">Seat No: {seat}</div>
          <Form.Group className="d-flex justify-content-center flex-column align-items-center">
            {index === 0 && (
              <>
                <Form.Label>ID Type: *</Form.Label>
                <Form.Control
                  as="select"
                  className="mb-2 w-50"
                  value={passengerData[index].idType}
                  onChange={(e) => handleChange(index, "idType", e.target.value)}
                >
                  <option value="">Select ID Type</option>
                  <option value="Aadhar">Aadhar Card</option>
                  <option value="PAN">PAN Card</option>
                </Form.Control>
                {errors[index]?.idType && <Alert variant="danger" className="w-50 p-1">{errors[index].idType}</Alert>}
                
                <Form.Label>ID Number: *</Form.Label>
                <Form.Control
                  className="mb-2 w-50"
                  type="text"
                  value={passengerData[index].id}
                  onChange={(e) => handleChange(index, "id", e.target.value)}
                />
                {errors[index]?.id && <Alert variant="danger" className="w-50 p-1">{errors[index].id}</Alert>}
                
                <Form.Label>Phone Number: *</Form.Label>
                <Form.Control
                  className="mb-2 w-50"
                  type="text"
                  value={passengerData[index].phone}
                  onChange={(e) => handleChange(index, "phone", e.target.value)}
                />
                {errors[index]?.phone && <Alert variant="danger" className="w-50 p-1">{errors[index].phone}</Alert>}
              </>
            )}
            
            <Form.Label>Name: *</Form.Label>
            <Form.Control
              className="mb-2 w-50"
              type="text"
              value={passengerData[index].name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            {errors[index]?.name && <Alert variant="danger" className="w-50 p-1">{errors[index].name}</Alert>}
            
            <Form.Label>Age: *</Form.Label>
            <Form.Control
              className="mb-2 w-50"
              type="number"
              value={passengerData[index].age}
              onChange={(e) => handleChange(index, "age", e.target.value)}
            />
            {errors[index]?.age && <Alert variant="danger" className="w-50 p-1">{errors[index].age}</Alert>}
            
            <Form.Label>Gender: *</Form.Label>
            <Form.Control
              as="select"
              className="mb-2 w-50"
              value={passengerData[index].gender}
              onChange={(e) => handleChange(index, "gender", e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Form.Control>
            {errors[index]?.gender && <Alert variant="danger" className="w-50 p-1">{errors[index].gender}</Alert>}
          </Form.Group>
        </div>
      ))}
        <Button className="ms-3 btn btn-success" onClick={handleProceedToPayment} disabled={selectedSeats.length === 0}>
          Book Now
        </Button>
    </div>
  );
}
