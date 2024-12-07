import React, { useEffect, useState } from "react";
import axios from "axios";

function RoomForm({ authToken }) {
  const [formData, setFormData] = useState({
    room_id: "", // Use room_id instead of id
    type: "",
    number: "",
    price: "",
    description: "",
    imageUrl: null,
  });

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]); // Always initialize as an empty array

  // Fetch existing rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/rooms", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log("Fetched rooms:", response.data); // Debugging: Check server response
        // Filter out any undefined or invalid rooms
        setRooms(response.data.filter(room => room && room.type)); // Ensure valid rooms only
      } catch (err) {
        console.error("Failed to fetch rooms.", err);
        setRooms([]); // Fallback to an empty array
      }
    };

    fetchRooms();
  }, [authToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, imageUrl: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      console.log("The room to be created or updated: ", formData);
      const url = formData.room_id
        ? `http://localhost:5000/api/rooms/${formData.room_id}`
        : "http://localhost:5000/api/rooms/";
      const method = formData.room_id ? "put" : "post";

      const response = await axios({
        method,
        url,
        data: formDataToSend,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response data:", response.data); // Debugging: Log response from server
      setMessage(response.data.message);

      // If updating a room, directly update the room in the local state
      if (formData.room_id) {
        setRooms((prev) =>
          prev.map((room) =>
            room.room_id === formData.room_id ? response.data.room : room
          )
        );
      } else {
        // If creating a new room, add it to the list
        setRooms((prev) => [...prev, response.data.room]);
      }

      // Reset form data
      setFormData({
        room_id: "",
        type: "",
        number: "",
        price: "",
        description: "",
        imageUrl: null,
      });
    } catch (err) {
      setError("Failed to process room. Please try again.");
      console.error(err);
    }
  };

  const handleDelete = async (roomId) => {
    setMessage(null);
    setError(null);

    try {
      await axios.delete(`http://localhost:5000/api/rooms/${roomId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setMessage("Room deleted successfully.");
      setRooms((prev) => prev.filter((room) => room.room_id !== roomId));
    } catch (err) {
      setError("Failed to delete room. Please try again.");
      console.error(err);
    }
  };

  const handleEdit = (room) => {
    setFormData({ ...room, imageUrl: null });
  };

  return (
    <div>
      <h1>Room Form</h1>
      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          name="room_id" // Use room_id here as well
          value={formData.room_id}
          onChange={handleChange}
        />
        <div>
          <label>Type:</label>
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number:</label>
          <input
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            name="imageUrl"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">{formData.room_id ? "Update" : "Create"} Room</button>
      </form>

      <h2>Existing Rooms</h2>
      {Array.isArray(rooms) && rooms.length > 0 ? (
        <ul>
          {rooms.map((room, index) => {
            if (!room || !room.type) {
              console.error(`Room at index ${index} is invalid:`, room);
              return null; // Skip this invalid room
            }
            const imageUrl = room.imageUrl ? `http://localhost:5000${room.imageUrl}` : null;
            return (
              <li key={room.room_id}>
                <p>{room.type} - ${room.price}</p>
                {imageUrl && <img src={imageUrl} alt={room.type} width={100} />}
                <br />
                <button onClick={() => handleEdit(room)}>Edit</button>
                <button onClick={() => handleDelete(room.room_id)}>Delete</button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>No rooms available.</p>
      )}
    </div>
  );
}

export default RoomForm;



