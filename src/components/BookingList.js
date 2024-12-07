import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import calendar styles

function BookingList({ onSelectBooking }) {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { authToken } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      console.log("Sending token in header:", authToken);
      try {
        const response = await axios.get("http://localhost:5000/api/bookings/", {
          headers: { 
            Authorization: `Bearer ${authToken}` 
          },
        });
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings.");
      }
    };

    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms/", {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        setRooms(response.data);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBookings(), fetchRooms()]);
      setLoading(false);
    };

    fetchData();
  }, [authToken]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Format the events for the calendar
  const events = bookings.map((booking) => ({
    date: new Date(booking.check_in_date).toLocaleDateString(), // Format to match the calendar
    title: `Room ${booking.room_id} - User ${booking.user_id} (Booked)`,
    status: "Booked",
    booking, // Attach the full booking object
  }));

  // Add available rooms as a separate list (no date associated)
  const availableRooms = rooms.filter(
    (room) => !bookings.some((booking) => booking.room_id === room.room_id)
  );

  const availableRoomEvents = availableRooms.map((room) => ({
    title: `Room ${room.room_id} (Available)`,
    status: "Available",
    room, // Attach the full room object
  }));

  // Filter events for the selected date
  const eventsOnSelectedDate = events.filter(
    (event) => event.date === selectedDate.toLocaleDateString()
  );

  const handleEventClick = (booking) => {
    if (booking) onSelectBooking(booking); // Pass the selected booking to the parent
  };

  return (
    <div>
      <h2>Booking Calendar</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />
      <h3>Events on {selectedDate.toLocaleDateString()}:</h3>
      <ul>
        {eventsOnSelectedDate.length > 0 ? (
          eventsOnSelectedDate.map((event, index) => (
            <li key={index} onClick={() => handleEventClick(event.booking)}>
              {event.title}
            </li>
          ))
        ) : (
          <li>No bookings for this date</li>
        )}
      </ul>

      <h3>Available Rooms:</h3>
      <ul>
        {availableRoomEvents.length > 0 ? (
          availableRoomEvents.map((room, index) => (
            <li key={index}>{room.title}</li>
          ))
        ) : (
          <li>No available rooms</li>
        )}
      </ul>
    </div>
  );
}

export default BookingList;










