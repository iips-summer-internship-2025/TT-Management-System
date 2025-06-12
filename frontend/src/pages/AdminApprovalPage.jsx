import { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaEnvelope,
  FaUser,
  FaUserTag,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { useAuth } from '../context/AuthContext';
import Heading from "../components/Heading";

const AdminApprovalPage = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingUsers = async () => {
      // Simulate API call
      setTimeout(() => {
        setPendingUsers([
          {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "student",
            requestedAt: "2023-05-15T10:30:00Z",
          },
          {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "faculty",
            requestedAt: "2023-05-16T11:45:00Z",
          },
        ]);
        setLoading(false);
      }, 1000);
    };

    fetchPendingUsers();
  }, []);

  const handleApprove = async (userId) => {
    // In a real app, you would send approval to the backend
    console.log("Approving user:", userId);
    // After approval, remove from pending list
    setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
    // Here the backend would send an approval email
  };

  const handleReject = async (userId) => {
    // In a real app, you would send rejection to the backend
    console.log("Rejecting user:", userId);
    // After rejection, remove from pending list
    setPendingUsers(pendingUsers.filter((user) => user.id !== userId));
    // Here the backend would send a rejection email if needed
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavBar onLogout={logout} />

      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Heading text="Admin Approval" />
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Manage the Faculty requests
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Pending User Approvals</h2>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4">Loading pending requests...</p>
            </div>
          ) : pendingUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No pending user requests</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 text-left">Name</th>
                    <th className="py-3 px-4 text-left">Email</th>
                    <th className="py-3 px-4 text-left">Role</th>
                    <th className="py-3 px-4 text-left">Request Date</th>
                    <th className="py-3 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 ">
                        <FaUser className="mr-2 text-gray-500" />
                        {user.name}
                      </td>
                      <td className="py-3 px-4 ">
                        <FaEnvelope className="mr-2 text-gray-500" />
                        {user.email}
                      </td>
                      <td className="py-3 px-4">
                        <FaUserTag className="mr-2 text-gray-500" />
                        {user.role}
                      </td>
                      <td className="py-3 px-4">
                        {formatDate(user.requestedAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                            title="Reject"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminApprovalPage;
