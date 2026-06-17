import { Navigate, Route, Routes } from "react-router-dom";
import Booking from "../pages/Booking.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Login from "../pages/Login.jsx";
import Manage from "../pages/Manage.jsx";
import Movies from "../pages/Movies.jsx";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import { ROLES } from "../utils/constants.js";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/movies"
        element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/booking"
        element={
          <ProtectedRoute roles={[ROLES.USER, ROLES.ADMIN]}>
            <Booking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage"
        element={
          <ProtectedRoute roles={[ROLES.THEATRE_OWNER, ROLES.ADMIN]}>
            <Manage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
