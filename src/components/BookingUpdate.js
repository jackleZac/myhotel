import React, { useState } from "react";
import axios from "axios";

function BookingUpdate({ booking, onUpdate, authToken }) {
  // Helper function to format dates for input fields
  const formatDateForInput = (date) => new Date(date).toISOString().slice(0, 10);

  const [updatedBooking, setUpdatedBooking] = useState({
    user_id: booking.user_id,
    room_id: booking.room_id,
    check_in_date: formatDateForInput(booking.check_in_date), // Format for input
    check_out_date: formatDateForInput(booking.check_out_date), // Format for input
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      // Prepare booking object with correctly formatted dates
      const formattedBooking = {
        ...updatedBooking,
        check_in_date: new Date(updatedBooking.check_in_date).toISOString().slice(0, 10),
        check_out_date: new Date(updatedBooking.check_out_date).toISOString().slice(0, 10),
      };

      await axios.put(
        `http://localhost:5000/api/bookings/${booking.id}`,
        formattedBooking,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("updated booking: ", formattedBooking);
      alert("Booking updated successfully!");
      onUpdate(); // Notify parent of update
    } catch (error) {
      console.log("updated booking: ", updatedBooking);
      alert(
        "Error updating booking: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${booking.id}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      alert("Booking deleted successfully!");
      onUpdate(); // Notify parent of deletion
    } catch (error) {
      alert(
        "Error deleting booking: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div>
      <h2>Update Booking</h2>
      <label>
        User ID:
        <input
          type="text"
          name="user_id"
          value={updatedBooking.user_id}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Room ID:
        <input
          type="text"
          name="room_id"
          value={updatedBooking.room_id}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Check-in Date:
        <input
          type="date"
          name="check_in_date"
          value={updatedBooking.check_in_date}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Check-out Date:
        <input
          type="date"
          name="check_out_date"
          value={updatedBooking.check_out_date}
          onChange={handleInputChange}
        />
      </label>
      <div>
        <button onClick={handleUpdate}>Update Booking</button>
        <button onClick={handleDelete} style={{ marginLeft: "10px" }}>
          Delete Booking
        </button>
      </div>
    </div>
  );
}

export default BookingUpdate;




