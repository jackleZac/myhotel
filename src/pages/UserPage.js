import React, { useState, useContext } from "react"; 
import { useNavigate } from "react-router-dom";
import RoomBooking from "../components/RoomBooking";
import RoomList from "../components/RoomList";
import BookingHistory from "../components/BookingHistory";
import { AuthContext } from "../context/AuthContext";

function UserPage() {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { authToken, userRole, userId } = useContext(AuthContext); // Use AuthContext for auth

  const navigate = useNavigate();

  return (
    <div>
      <h1>User Portal</h1>
      {authToken ? (
        <div>
          <h2>Welcome, authenticated user!</h2>
          <RoomBooking authToken={authToken} userId={userId} selectedRoom={selectedRoom} />
          <RoomList authToken={authToken} onRoomSelect={setSelectedRoom} />
          <BookingHistory authToken={authToken} userId={userId} />

          {/* Button to navigate to UpdateUserPage */}
          <button
            onClick={() => navigate("/user/update")} // Navigate to the UpdateUserPage
            style={{ marginTop: "20px" }}
          >
            Update Profile
          </button>
        </div>
      ) : (
        <p>You must be logged in to view this page.</p>
      )}

      {/* Back button */}
      <button onClick={() => navigate(-1)} style={{ marginTop: "10px" }}>
        Back to Previous Page
      </button>
    </div>
  );
}

export default UserPage;



