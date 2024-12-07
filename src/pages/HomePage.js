import React from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Import the AuthContext

function HomePage() {
  const navigate = useNavigate();
  const { authToken, userRole, setAuthToken, setUserRole } = useContext(AuthContext); // Access AuthContext

  // Define links for users and admins
  const userLinks = [
    { name: "Book a Room", path: "/user" },
    { name: "My Bookings", path: "/user" },
    { name: "Update Profile", path: "/user/update" },
  ];

  const adminLinks = [
    { name: "Manage Rooms", path: "/admin" },
    { name: "Manage Bookings", path: "/admin" },
    { name: "View Reports", path: "/admin" },
  ];

  // Handle navigation to the requested path
  const handleNavigation = (path) => {
    if (!authToken) {
      console.log("Token (not logged in)", authToken);
      console.log("UserRole (not logged in)", userRole);
      // Redirect unauthenticated users to the login page
      navigate(`/login?redirect=${encodeURIComponent(path)}`);
    } else {
      console.log("Token (Authenticated)", authToken);
      console.log("UserRole (Authenticated)", userRole);
      // Allow authenticated navigation
      navigate(path);
    }
  };

  // Handle logout to clear authToken and userRole
  const handleLogout = () => {
    // Clear the auth token and user role from localStorage and context
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    setAuthToken(null);
    setUserRole(null);
    // Redirect to login page after logout
    navigate("/login");
  };

  // Navigate to registration page
  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div className="home-page min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto max-w-4xl bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to HomePage</h1>
        <p className="text-gray-600 mt-2">
          Everyone is welcome here! Use the links below to explore the features based on your role.
        </p>

        <section className="quick-links mt-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Links</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Show user links only if logged in */}
            {authToken ? (
              <>
                {userLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-300"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
                {adminLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleNavigation(link.path)}
                      className="w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg shadow-md transition duration-300"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </>
            ) : (
              <p className="text-gray-600">Please log in to access user or admin features.</p>
            )}
          </ul>
        </section>

        {/* Register button shown if not logged in */}
        {!authToken && (
          <div className="mt-6">
            <button
              onClick={handleRegister}
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition duration-300"
            >
              Register
            </button>
          </div>
        )}

        {/* Display logout button if user is logged in */}
        {authToken && (
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg shadow-md transition duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;



