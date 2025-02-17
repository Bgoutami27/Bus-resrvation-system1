import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { locations } from "./index";

const getCoordinates = async (location) => {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    location
  )}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    } else {
      console.error("No coordinates found for:", location);
      return null;
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    return null;
  }
};

function MapComponent() {
  const [coordinates, setCoordinates] = useState({});

  useEffect(() => {
    const fetchCoordinates = async () => {
      let coordData = {};
      for (let loc of locations) {
        coordData[loc] = await getCoordinates(loc);
      }
      setCoordinates(coordData);
    };

    fetchCoordinates();
  }, []);

  return (
    <MapContainer center={[11.0, 78.0]} zoom={7} style={{ height: "400px", width: "100%" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {Object.entries(coordinates).map(([loc, coord]) =>
        coord ? (
          <Marker key={loc} position={[coord.lat, coord.lng]}>
            <Popup>{loc}</Popup>
          </Marker>
        ) : null
      )}
    </MapContainer>
  );
}

export default MapComponent;
