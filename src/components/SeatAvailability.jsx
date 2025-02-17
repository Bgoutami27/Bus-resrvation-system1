import React, { useState } from 'react';

const SeatAvailability = () => {
  const [response, setResponse] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [inputDate, setInputDate] = useState('');

  const checkAvailability = () => {
    fetch(`/api/checkAvailability?source=${source}&destination=${destination}&date=${inputDate}`)
      .then((res) => res.json())
      .then((data) => {
        setResponse(`Seats available: ${data.seats.join(", ")}`);
      })
      .catch((error) => {
        setResponse("Sorry, there was an error while checking seat availability.");
      });
  };

  return (
    <div>
      <input 
        type="text" 
        placeholder="Source" 
        value={source} 
        onChange={(e) => setSource(e.target.value)} 
      />
      <input 
        type="text" 
        placeholder="Destination" 
        value={destination} 
        onChange={(e) => setDestination(e.target.value)} 
      />
      <input 
        type="date" 
        value={inputDate} 
        onChange={(e) => setInputDate(e.target.value)} 
      />
      <button onClick={checkAvailability}>Check Availability</button>
      <p>{response}</p>
    </div>
  );
};

export default SeatAvailability;
