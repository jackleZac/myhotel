// src/App.js
import "./styles.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute
import Login from "./components/Login";
import Registration from "./components/Registration";
import UpdateUserProfile from "./pages/UpdateUserProfile";

export default function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* HomePage accessible to everyone */}
          <Route path="/" element={<HomePage />} />
          {/* Login route */}
          <Route path="/login" element={<Login />} />
          {/* Registration route */}
          <Route path="/register" element={<Registration />} />
          {/* Guarded admin route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPage />
              </ProtectedRoute>
            }
          />
          {/* Guarded user route */}
          <Route
            path="/user"
            element={
              <ProtectedRoute requiredRole="user">
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/update"
            element={
              <ProtectedRoute requiredRole="user">
                <UpdateUserProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}
