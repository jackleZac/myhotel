import React, { useState } from "react"; 
import axios from "axios";

function RoomList({ authToken, onRoomSelect }) {
  const [rooms, setRooms] = useState([]);
  const [allRooms, setAllRooms] = useState([]); // Store all rooms fetched from the backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [check_in_date, setcheck_in_date] = useState("");
  const [check_out_date, setcheck_out_date] = useState("");

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [roomType, setRoomType] = useState(""); // Store selected room type

  // Fetch rooms from the backend
  const fetchRooms = async () => {
    if (!check_in_date || !check_out_date) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/rooms", {
        params: {
          check_in_date: check_in_date,
          check_out_date: check_out_date,
        },
        headers: {
          Authorization: `Bearer ${authToken}`, // Include authToken in the request header
        },
      });
      setAllRooms(response.data); // Store all rooms fetched from the backend
      setRooms(response.data);   // Display all rooms initially
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters on the frontend
  const handleFilter = () => {
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      setError("Minimum price cannot be greater than maximum price.");
      return;
    }

    setError(null);

    // Filter rooms by price and type
    const filteredRooms = allRooms.filter((room) => {
      const roomPrice = Number(room.price);
      const min = minPrice ? Number(minPrice) : -Infinity;
      const max = maxPrice ? Number(maxPrice) : Infinity;
      const matchesPrice = roomPrice >= min && roomPrice <= max;
      const matchesType = roomType ? room.type === roomType : true;

      return matchesPrice && matchesType;
    });

    setRooms(filteredRooms); // Update state with the filtered rooms
  };

  if (loading) return <div>Loading rooms...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Available Rooms</h2>

      {/* Date Inputs */}
      <div>
        <label>Check-In Date:</label>
        <input
          type="date"
          value={check_in_date}
          onChange={(e) => setcheck_in_date(e.target.value)}
        />
        <label>Check-Out Date:</label>
        <input
          type="date"
          value={check_out_date}
          onChange={(e) => setcheck_out_date(e.target.value)}
        />
        <button onClick={fetchRooms}>Search</button>
      </div>

      {/* Filter Inputs */}
      <div style={{ marginTop: "20px" }}>
        <h3>Filters</h3>
        <label>Price Range:</label>
        <div>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Min Price"
          />
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Max Price"
          />
        </div>
        <div>
          <label>Room Type:</label>
          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
          >
            <option value="">Select Room Type</option>
            <option value="Suite">Suite</option>
            <option value="Double">Double</option>
            <option value="Single">Single</option>
          </select>
        </div>
        <button onClick={handleFilter}>Apply Filters</button>
        <button onClick={() => setRooms(allRooms)}>Reset Filters</button>
      </div>

      {/* Room List */}
      {rooms.length === 0 ? (
        <p>No available rooms for the selected dates and filters.</p>
      ) : (
        <ul>
          {rooms.map((room) => {
            const imageUrl = room.imageUrl ? `http://localhost:5000${room.imageUrl}` : null;
            return (
              <li
                key={room.room_id}
                onClick={() => onRoomSelect(room)} // Invoke callback with the selected room
                style={{ cursor: "pointer", marginBottom: "10px" }}
              >
                <strong>{room.type}</strong>: ${room.price} per night
                <br />
                Description: {room.description}
                <br />
                {imageUrl && <img src={imageUrl} alt={room.type} width={150} />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default RoomList;





