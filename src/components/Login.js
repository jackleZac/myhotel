import React, { useState } from "react";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Access your AuthContext
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { setAuthToken, setUserRole, setUserId } = useContext(AuthContext); // Access context functions
  const navigate = useNavigate();
  const location = useLocation(); // Get the current URL and query parameters

  // Handle the login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send a request to the backend to authenticate the user
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });

      const { message, token, user } = response.data;

      // Save the token and user role to context and localStorage for persistence
      setAuthToken(token);
      setUserRole(user.role);
      setUserId(user.user_id);

      console.log("Log In as ", user.username);

      localStorage.setItem("authToken", token);
      console.log("Log In with AuthToken:", token);

      localStorage.setItem("userRole", user.role);
      console.log("Log In with userRole:", user.role);

      localStorage.setItem("userId", user.user_id); 
      console.log("Log in with userId:", user.user_id);

      // Determine the redirect path
      const defaultRedirect = user.role === "admin" ? "/admin" : "/user";
      const redirectPath = new URLSearchParams(location.search).get("redirect") || defaultRedirect;

      // Navigate to the redirected path or default
      navigate(redirectPath);

      // Show a success message
      alert(message);
    } catch (error) {
      // Handle any login errors (e.g., invalid credentials)
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
            disabled={loading}
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            disabled={loading}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {loading && <p>Loading, please wait...</p>}
    </div>
  );
}

export default Login;





