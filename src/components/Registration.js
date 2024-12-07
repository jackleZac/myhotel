import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function Registration({ onRegister }) {
  const navigate = useNavigate(); // Initialize navigate function

  // State for form data
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user"); // Default role
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState(null); // State to handle errors
  const [loading, setLoading] = useState(false); // State to handle loading

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null); // Reset error
    setLoading(true); // Start loading

    try {
      // Send the registration data, including role, email, and phone number
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        password,
        role,
        email,
        phone_number: phoneNumber, // Correctly named to match your database column
      });

      const { message, userId } = response.data;
      console.log("Registration successful:", response.data);
      
      alert(`${message} (User ID: ${userId})`); // Notify user of success
      onRegister(); // Trigger any post-registration logic

      // Redirect to login page after successful registration
      navigate("/login"); // Use navigate to redirect to login
    } catch (error) {
      // Handle error response
      setError(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error */}

      {/* Form fields for username, password, email, phone number, and role */}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Phone Number"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button type="submit" disabled={loading}>
        {loading ? "Registering..." : "Register"}
      </button>

      {/* Link to navigate to login page */}
      <div>
        <p>Already have an account? <button onClick={() => navigate("/login")}>Login</button></p>
      </div>
    </form>
  );
}

export default Registration;


