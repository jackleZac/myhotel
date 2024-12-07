import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import RoomForm from "../components/RoomForm";
import BookingList from "../components/BookingList";
import BookingUpdate from "../components/BookingUpdate";
import ViewReports from "../components/ViewReports";

function AdminPage() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const { authToken, userId } = useContext(AuthContext); // Access only authToken if needed
  const navigate = useNavigate();

  const handleSelectBooking = (booking) => {
    setSelectedBooking(booking);
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {/* Room management form */}
      <RoomForm authToken={authToken} />

      {/* Display list of all bookings and allow selection */}
      <h2>All Bookings</h2>
      <BookingList onSelectBooking={handleSelectBooking} authToken={authToken} />

      {/* Update booking if one is selected */}
      {selectedBooking && (
        <BookingUpdate
          booking={selectedBooking}
          onUpdate={() => setSelectedBooking(null)}
          authToken={authToken}
        />
      )}

      {/* Generate monthly reports */}
      <ViewReports authToken={authToken} />

      {/* Navigation Button */}
      <button onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
        Back to Previous Page
      </button>
    </div>
  );
}

export default AdminPage;


