import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import CreateTable from "../pages/CreateTable";
import UpdateTimeTable from "../pages/UpdateTimeTable";
import ViewTable from "../pages/ViewTimeTable";
import Subjects from "../pages/ManageSubjects";
import Rooms from "../pages/ManageRooms";
import PrivateRoute from "../components/PrivateRoute";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/LoadingScreen";
import AdminDashboard from "../pages/logPage/AdminDashboard";
import FacultyDashboard from "../pages/logPage/FacultyDashboard";


const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/admin-dashboard"
        element={
          <PrivateRoute requiredRoles={["Admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/faculty-dashboard"
        element={
          <PrivateRoute requiredRoles={["Faculty"]}>
            <FacultyDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/create-timetable"
        element={
          <PrivateRoute requiredRoles={["Admin"]}>
            <CreateTable />
          </PrivateRoute>
        }
      />
      <Route
        path="/update-timetable"
        element={
          <PrivateRoute requiredRoles={["Admin"]}>
            <UpdateTimeTable />
          </PrivateRoute>
        }
      />
      <Route
        path="/view-timetable"
        element={
          <PrivateRoute requiredRoles={["Admin", "Faculty"]}>
            <ViewTable />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-subjects"
        element={
          <PrivateRoute requiredRoles={["Admin"]}>
            <Subjects />
          </PrivateRoute>
        }
      />
      <Route
        path="/manage-rooms"
        element={
          <PrivateRoute requiredRoles={["Admin"]}>
            <Rooms />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
