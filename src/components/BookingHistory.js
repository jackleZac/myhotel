// src/components/BookingHistory.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function BookingHistory({ authToken, userId }) {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/bookings/${userId}`
        , {
          headers: {
          Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
        }});
        setUserBookings(response.data); // Assume backend returns an array of bookings
        console.log('Bookings History:', response.data);
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load booking history.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  if (loading) return <div>Loading booking history...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Booking History</h2>
      {userBookings.length > 0 ? (
        <ul>
          {userBookings.map((booking, index) => (
            <li key={index}>
              Room Id: {booking.room_id} | Check-In: {booking.check_in_date} |
              Check-Out: {booking.check_out_date}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
}

export default BookingHistory;
