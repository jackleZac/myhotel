// src/pages/UpdateUserPage.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function UpdateUserProfile() {
  const [user, setUser] = useState(null);
  const [updatedUser, setUpdatedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);  // Add error state

  const { userId } = useContext(AuthContext);

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/${Number(userId)}`
        );
        setUser(response.data.user);
        setUpdatedUser(response.data.user); // Initialize updatedUser with fetched user data
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data.");
      }
    };

    fetchUser();
  }, [userId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const updatedData = { ...updatedUser };
  
    // If password was not changed, remove it from the payload
    if (!updatedData.password || updatedData.password === user.password) {
      delete updatedData.password;
    }
  
    try {
      const response = await axios.put("http://localhost:5000/api/auth/update-profile", updatedData);
      
      if (response.status === 200) {
        setUser(updatedUser);
        setIsEditing(false);
        console.log("User updated successfully");
      } else {
        console.error("Failed to update user:", response.data.error);
        alert("Failed to update user. Please try again later.");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again later.");
    }
  };
  

  // Toggle edit mode
  const toggleEdit = (e) => {
    e.preventDefault(); // Prevent form submission when toggling edit mode
    console.log("Toggling edit mode");
    setIsEditing(!isEditing);
  };

  if (error) return <p>{error}</p>;

  if (!user) return <p>Loading user data...</p>;

  return (
    <div>
      <h1>User Profile</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="username"
            value={updatedUser.username}
            onChange={handleChange}
            disabled={!isEditing}  // This will disable the input if not in editing mode
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={updatedUser.password}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            value={updatedUser.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        <div>
          <label>Phone Number:</label>
          <input
            type="text"
            name="phone_number"
            value={updatedUser.phone_number}
            onChange={handleChange}
            disabled={!isEditing}
          />
        </div>

        {isEditing ? (
          <button type="submit">Save Changes</button>
        ) : (
          <button type="button" onClick={toggleEdit}>
            Update Profile
          </button>
        )}
      </form>
    </div>
  );
}

export default UpdateUserProfile;
