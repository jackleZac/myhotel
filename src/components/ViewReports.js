import React, { useEffect, useState } from "react";
import axios from "axios";

function ViewReports({ authToken }) {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch all rooms
        const roomResponse = await axios.get("http://localhost:5000/api/rooms/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        // Fetch all bookings
        const bookingResponse = await axios.get("http://localhost:5000/api/bookings/", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        setRooms(roomResponse.data);
        setBookings(bookingResponse.data);
      } catch (err) {
        setError("Failed to load reports.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const calculateOccupancyRate = () => {
    const totalRooms = rooms.length;
    const occupiedRooms = bookings.reduce((acc, booking) => {
      const isOccupied = rooms.some(room => room.number === booking.roomNumber);
      return isOccupied ? acc + 1 : acc;
    }, 0);
    return totalRooms > 0 ? ((occupiedRooms / totalRooms) * 100).toFixed(2) : "0";
  };

  if (loading) return <div>Loading reports...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="view-reports">
      <h2>Monthly Booking Reports</h2>
      <h3>Occupancy Rate: {calculateOccupancyRate()}%</h3>
      
      <table>
        <thead>
          <tr>
            <th>Room Number</th>
            <th>Type</th>
            <th>Price</th>
            <th>Occupied</th>
            <th>Customer Name</th>
            <th>Reservation Date</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => {
            const roomBookings = bookings.filter(
              (booking) => booking.roomNumber === room.number
            );
            return roomBookings.length > 0 ? (
              roomBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{room.number}</td>
                  <td>{room.type}</td>
                  <td>{room.price}</td>
                  <td>Yes</td>
                  <td>{booking.customerName}</td>
                  <td>{new Date(booking.reservationDate).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr key={room.id}>
                <td>{room.number}</td>
                <td>{room.type}</td>
                <td>{room.price}</td>
                <td>No</td>
                <td>N/A</td>
                <td>N/A</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ViewReports;
