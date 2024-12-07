import React, { useState, useEffect } from "react";
import axios from "axios";

function RoomBooking({ authToken, userId, selectedRoom }) {
  const [formData, setFormData] = useState({
    user_id: userId ? userId : "",
    room_id: "",
    type: "",
    price: "",
    check_in_date: "",
    check_out_date: "",
  });

  // Update form when selectedRoom changes
  useEffect(() => {
    if (selectedRoom) {
      setFormData({
        ...formData,
        room_id: selectedRoom.room_id,
        type: selectedRoom.type,
        price: selectedRoom.price,
        check_in_date: "",
        check_out_date: "",
      });
    }
  }, [selectedRoom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBooking = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate the form before submitting
    if (!formData.check_in_date || !formData.check_out_date) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    try {
      // Send the booking request
      const response = await axios.post(
        "http://localhost:5000/api/bookings/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${ authToken }`, // Pass the authToken for authentication
          },
        }
      );
      
      console.log("Booking successful:", response.data);
      alert("Booking successful!");
    } catch (err) {
      console.error("Error booking room:", err);
      alert("Failed to book the room.");
    }
  };

  return (
    <div>
      <h2>Book a Room</h2>
      {selectedRoom ? (
        <form onSubmit={handleBooking}>
          <div>
            <label>Room Type:</label>
            <input
              type="text"
              value={formData.type}
              name="type"
              onChange={handleChange}
              readOnly
            />
          </div>
          <div>
            <label>Price:</label>
            <input
              type="text"
              value={formData.price}
              name="price"
              onChange={handleChange}
              readOnly
            />
          </div>
          <div>
            <label>Check-In Date:</label>
            <input
              type="date"
              value={formData.check_in_date}
              name="check_in_date"
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Check-Out Date:</label>
            <input
              type="date"
              value={formData.check_out_date}
              name="check_out_date"
              onChange={handleChange}
            />
          </div>
          <button type="submit">Book Now</button>
        </form>
      ) : (
        <p>Please select a room from the list.</p>
      )}
    </div>
  );
}

export default RoomBooking;
