import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NavBar from "../components/NavBar";
import Heading from "../components/Heading";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCalendar, FaSpinner, FaSearch } from "react-icons/fa";

const ManageBatches = () => {
    const [batches, setBatches] = useState([]);
    const [filteredBatches, setFilteredBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [addingBatch, setAddingBatch] = useState(false);
    const [editingBatch, setEditingBatch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [newBatch, setNewBatch] = useState({
        ID: "",
        BatchName: "",
        BatchYear: ""
    });

    const navigate = useNavigate();

    const API_BASE_URL = "http://localhost:8080/api/v1";
    const API_ENDPOINTS = {
        GET_BATCHES: `${API_BASE_URL}/batch`,
        ADD_BATCH: `${API_BASE_URL}/batch`,
        UPDATE_BATCH: (id) => `${API_BASE_URL}/batch/${id}`,
        DELETE_BATCH: (id) => `${API_BASE_URL}/batch/${id}`
    };

    const fetchBatches = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch(API_ENDPOINTS.GET_BATCHES);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setBatches(data);
            setFilteredBatches(data);
        } catch (err) {
            setError("Failed to load batches. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBatches();
    }, []);

    useEffect(() => {
        const results = batches.filter(batch =>
            batch.BatchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            batch.BatchYear.toString().includes(searchTerm)
        );
        setFilteredBatches(results);
    }, [searchTerm, batches]);

    const handleSaveBatch = async () => {
        if (!newBatch.BatchName.trim() || !newBatch.BatchYear) {
            alert('Please fill in all required fields');
            return;
        }

        try {
            editingBatch ? setEditingBatch(true) : setAddingBatch(true);

            const endpoint = editingBatch
                ? API_ENDPOINTS.UPDATE_BATCH(newBatch.ID)
                : API_ENDPOINTS.ADD_BATCH;

            const method = editingBatch ? 'PUT' : 'POST';

            const batchData = {
                BatchName: newBatch.BatchName.trim(),
                BatchYear: parseInt(newBatch.BatchYear)
            };

            if (editingBatch) batchData.ID = newBatch.ID;

            const response = await fetch(endpoint, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(batchData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${editingBatch ? 'update' : 'add'} batch`);
            }

            await fetchBatches();
            resetForm();
            setShowAddDialog(false);

        } catch (err) {
            alert(`Failed to ${editingBatch ? 'update' : 'add'} batch: ${err.message}`);
        } finally {
            setAddingBatch(false);
            setEditingBatch(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this batch?")) return;

        try {
            const response = await fetch(API_ENDPOINTS.DELETE_BATCH(id), {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            setBatches(batches.filter(batch => batch.ID !== id));
            setFilteredBatches(filteredBatches.filter(batch => batch.ID !== id));

        } catch (err) {
            alert(`Failed to delete batch: ${err.message}`);
        }
    };

    const handleEdit = (batch) => {
        setNewBatch({ ID: batch.ID, BatchName: batch.BatchName, BatchYear: batch.BatchYear });
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
        setNewBatch({ ID: "", BatchName: "", BatchYear: "" });
        setEditingBatch(false);
    };

    // Loading & Error States
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-100">
                <NavBar />
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-blue-500 text-2xl" />
                    <span className="ml-2 text-slate-600">Loading batches...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-100">
                <NavBar />
                <div className="text-center py-20">
                    <p className="text-red-600 mb-4">{error}</p>
                    <button
                        onClick={fetchBatches}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <NavBar />

            <div className="px-4 pt-6">
                <div className="flex justify-between items-center">
                    <Heading text="Manage Batches" />
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="bg-slate-600 text-white px-4 py-2 rounded"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="my-4 flex justify-between items-center">
                    <div className="relative w-full sm:w-64">
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search batches..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-full py-2 border border-slate-300 rounded"
                        />
                    </div>
                    <button
                        onClick={handleAddNewBatch}
                        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded flex items-center space-x-2"
                    >
                        <FaPlus />
                        <span>Add Batch</span>
                    </button>
                </div>

                <div className="bg-white rounded shadow p-4">
                    {filteredBatches.length === 0 ? (
                        <p className="text-center text-slate-500 py-12">
                            {searchTerm ? "No matching batches found." : "No batches available. Add a new batch."}
                        </p>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-200">
                                    <th className="p-2">Batch Name</th>
                                    <th className="p-2">Year</th>
                                    <th className="p-2 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBatches.map(batch => (
                                    <tr key={batch.ID} className="border-b hover:bg-slate-50">
                                        <td className="p-2">{batch.BatchName}</td>
                                        <td className="p-2">{batch.BatchYear}</td>
                                        <td className="p-2 text-center">
                                            <button
                                                onClick={() => handleEdit(batch)}
                                                className="text-green-600 hover:underline mr-2"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(batch.ID)}
                                                className="text-red-600 hover:underline"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {showAddDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
                    <div className="bg-white rounded p-6 shadow w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">{editingBatch ? "Edit Batch" : "Add New Batch"}</h2>
                            <button onClick={handleCancel} disabled={addingBatch}>
                                <FaTimes />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Batch Name *</label>
                                <input
                                    type="text"
                                    value={newBatch.BatchName}
                                    onChange={(e) => setNewBatch(prev => ({ ...prev, BatchName: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded"
                                    disabled={addingBatch}
                                />
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Batch Year *</label>
                                <input
                                    type="number"
                                    value={newBatch.BatchYear}
                                    onChange={(e) => setNewBatch(prev => ({ ...prev, BatchYear: e.target.value }))}
                                    className="w-full px-3 py-2 border border-slate-300 rounded"
                                    disabled={addingBatch}
                                />
                            </div>
                        </div>
                        <div className="mt-6 text-right">
                            <button
                                onClick={handleSaveBatch}
                                disabled={addingBatch}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                {editingBatch ? "Update Batch" : "Add Batch"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageBatches;
