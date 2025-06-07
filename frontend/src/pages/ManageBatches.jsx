import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Heading from "../components/Heading";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTimes,
  FaCalendar,
  FaSpinner,
  FaSearch,
  FaBook,
} from "react-icons/fa";

const ManageBatches = () => {
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filteredBatches, setFilteredBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [addingBatch, setAddingBatch] = useState(false);
  const [editingBatch, setEditingBatch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newBatch, setNewBatch] = useState({
    ID: "",
    year: "",
    section: "",
    course_id: "",
  });

  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:8080/api/v1";
  const API_ENDPOINTS = {
    GET_BATCHES: `${API_BASE_URL}/batch`,
    GET_COURSES: `${API_BASE_URL}/course`,
    ADD_BATCH: `${API_BASE_URL}/batch`,
    UPDATE_BATCH: (id) => `${API_BASE_URL}/batch/${id}`,
    DELETE_BATCH: (id) => `${API_BASE_URL}/batch/${id}`,
  };

  // Helper function to get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  // Helper function to handle authentication errors
  const handleAuthError = (response) => {
    if (response.status === 401) {
      // Clear stored tokens
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      // Redirect to login
      navigate('/');
      return true;
    }
    return false;
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_COURSES, {
        method: 'GET',
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (handleAuthError(response)) {
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch courses");
      }

      const data = await response.json();
      setCourses(data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const [batchesResponse] = await Promise.all([
        fetch(API_ENDPOINTS.GET_BATCHES, {
          method: "GET",
          headers: getAuthHeaders(),
          credentials: 'include',
        }),
        fetchCourses(),
      ]);

      if (handleAuthError(batchesResponse)) {
        return;
      }

      if (!batchesResponse.ok) {
        throw new Error(`HTTP error! status: ${batchesResponse.status}`);
      }

      const batchesData = await batchesResponse.json();

      const formattedBatches = batchesData.map((batch) => ({
        id: batch.ID,
        year: batch.Year.toString(), // Store as string in frontend
        section: batch.Section,
        course_id: batch.CourseID,
      }));

      setBatches(formattedBatches);
      setFilteredBatches(formattedBatches);
    } catch (err) {
      console.error("Error fetching batches:", err);
      setError("Failed to load batches. Please try again.");
      setBatches([]);
      setFilteredBatches([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  useEffect(() => {
    const results = batches.filter(
      (batch) =>
        (batch.year &&
          batch.year
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (batch.section &&
          batch.section.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (batch.course_id &&
          batch.course_id
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase()))
    );
    setFilteredBatches(results);
  }, [searchTerm, batches]);

  const handleSaveNewBatch = async () => {
    if (
      !newBatch.year.trim() ||
      !newBatch.section.trim() ||
      !newBatch.course_id
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate year is a valid number
    const yearNumber = parseInt(newBatch.year.trim());
    if (isNaN(yearNumber)) {
      alert("Please enter a valid year (numbers only)");
      return;
    }

    try {
      editingBatch ? setEditingBatch(true) : setAddingBatch(true);

      const batchData = {
        Year: yearNumber, // Convert to number for backend
        Section: newBatch.section.trim().toUpperCase(),
        CourseID: Number(newBatch.course_id),
      };

      const isUpdate = !!newBatch.ID;
      const endpoint = isUpdate
        ? API_ENDPOINTS.UPDATE_BATCH(newBatch.ID)
        : API_ENDPOINTS.ADD_BATCH;
      const method = isUpdate ? "PUT" : "POST";

      if (isUpdate) {
        batchData.ID = newBatch.ID;
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(batchData),
      });

      if (handleAuthError(response)) {
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isUpdate ? 'update' : 'add'} batch`);
      }

      await fetchBatches();
      resetForm();
      setShowAddDialog(false);
    } catch (err) {
      console.error(`Error ${editingBatch ? 'updating' : 'adding'} batch:`, err);
      alert(`Failed to ${newBatch.ID ? "update" : "add"} batch: ${err.message}`);
    } finally {
      setAddingBatch(false);
      setEditingBatch(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this batch? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.DELETE_BATCH(id), {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: 'include',
      });

      if (handleAuthError(response)) {
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setBatches(batches.filter((batch) => batch.id !== id));
      setFilteredBatches(filteredBatches.filter((batch) => batch.id !== id));
    } catch (err) {
      console.error("Error deleting batch:", err);
      alert(`Failed to delete batch: ${err.message}`);
    }
  };

  const handleEdit = (batch) => {
    setNewBatch({
      ID: batch.id,
      year: batch.year.toString(), // Ensure year is string
      section: batch.section,
      course_id: batch.course_id,
    });
    setEditingBatch(true);
    setShowAddDialog(true);
  };

  const handleAddNewBatch = () => {
    resetForm();
    setShowAddDialog(true);
  };

  const handleCancel = () => {
    resetForm();
    setShowAddDialog(false);
  };

  const resetForm = () => {
    setNewBatch({
      ID: "",
      year: "",
      section: "",
      course_id: "",
    });
    setEditingBatch(false);
  };

  const getCoursesDisplay = (batch) => {
    const course = courses.find((c) => c.ID === batch.course_id);
    return course ? `${course.Code} - ${course.Name}` : "General Course";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-3">
            <FaSpinner className="animate-spin text-blue-500 text-2xl" />
            <span className="text-slate-600 text-lg">Loading batches...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <NavBar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
              onClick={fetchBatches}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavBar />

      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Heading text="Manage Batches" />
            <p className="text-slate-600 mt-2 text-sm sm:text-base">
              Add, edit, and manage course batches
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
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-50 px-6 py-4 border-b border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                <FaBook className="text-white text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Batch Management
                </h2>
                <p className="text-sm text-slate-600">
                  {filteredBatches.length} of {batches.length} batches
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search batches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                />
              </div>
              <button
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm font-medium"
                onClick={handleAddNewBatch}
              >
                <FaPlus className="text-sm" />
                <span>Add Batch</span>
              </button>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-800 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Year</th>
                  <th className="px-6 py-4 text-left font-semibold">Section</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Course
                  </th>
                  <th className="px-6 py-4 text-center font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBatches.map((batch) => (
                  <tr
                    key={`desktop-${batch.id}`}
                    className="hover:bg-blue-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{batch.year}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{batch.section}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600">{getCoursesDisplay(batch)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm"
                          onClick={() => handleEdit(batch)}
                          title="Edit Batch"
                        >
                          <FaEdit className="text-sm" />
                        </button>
                        <button
                          className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-lg transition-colors duration-200 shadow-sm"
                          onClick={() => handleDelete(batch.id)}
                          title="Delete Batch"
                        >
                          <FaTrash className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-slate-200">
            {filteredBatches.map((batch) => (
              <div
                key={`mobile-${batch.id}`}
                className="p-4 hover:bg-slate-50 transition-colors duration-150"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-lg">
                      <FaCalendar className="text-white text-sm" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-800">
                        {batch.year} - Section {batch.section}
                      </div>
                      <div className="text-sm text-slate-600">
                        {getCoursesDisplay(batch)}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors duration-200"
                      onClick={() => handleEdit(batch)}
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      className="bg-rose-500 hover:bg-rose-600 text-white p-2 rounded-lg transition-colors duration-200"
                      onClick={() => handleDelete(batch.id)}
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredBatches.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaBook className="mx-auto text-slate-400 text-4xl mb-4" />
              <h3 className="text-lg font-medium text-slate-800 mb-2">
                {searchTerm ? "No matching batches found" : "No Batches Found"}
              </h3>
              <p className="text-slate-600 mb-4">
                {searchTerm
                  ? "Try a different search term"
                  : "Get started by adding your first batch."}
              </p>
              {!searchTerm && (
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center space-x-2 mx-auto shadow-sm font-medium"
                  onClick={handleAddNewBatch}
                >
                  <FaPlus />
                  <span>Add First Batch</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Batch Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between p-6 border-b border-slate-200 rounded-t-xl">
              <h3 className="text-lg font-semibold text-slate-800">
                {editingBatch ? "Edit Batch" : "Add New Batch"}
              </h3>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                disabled={addingBatch}
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Year */}
              <div>
                <label
                  htmlFor="batchYear"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Year *
                </label>
                <input
                  id="batchYear"
                  type="text"
                  value={newBatch.year}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value;
                    setNewBatch((prev) => ({ ...prev, year: value }));
                  }}
                  placeholder="Enter batch year (e.g., 2023)"
                  disabled={addingBatch}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  autoFocus
                />
              </div>

              {/* Section */}
              <div>
                <label
                  htmlFor="batchSection"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Section *
                </label>
                <input
                  id="batchSection"
                  type="text"
                  value={newBatch.section}
                  onChange={(e) =>
                    setNewBatch((prev) => ({
                      ...prev,
                      section: e.target.value,
                    }))
                  }
                  placeholder="Enter section (e.g., A, B)"
                  disabled={addingBatch}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>

              {/* Course ID */}
              <div>
                <label
                  htmlFor="course_id"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Course *
                </label>
                <select
                  id="course_id"
                  value={newBatch.course_id}
                  onChange={(e) =>
                    setNewBatch((prev) => ({
                      ...prev,
                      course_id: e.target.value,
                    }))
                  }
                  disabled={addingBatch || courses.length === 0}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.ID} value={course.ID}>
                      {course.Code} - {course.Name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleSaveNewBatch}
                  disabled={
                    !newBatch.year.trim() ||
                    !newBatch.section.trim() ||
                    !newBatch.course_id ||
                    addingBatch
                  }
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:from-slate-300 disabled:to-slate-400 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {addingBatch ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      <span>{editingBatch ? "Updating..." : "Adding..."}</span>
                    </>
                  ) : (
                    <span>{editingBatch ? "Update Batch" : "Add Batch"}</span>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={addingBatch}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 disabled:bg-slate-50 text-slate-700 py-3 px-4 rounded-lg transition-colors duration-200 font-medium disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBatches;