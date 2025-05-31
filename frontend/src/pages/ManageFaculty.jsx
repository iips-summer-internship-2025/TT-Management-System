import React from "react";
import data from "../assets/academicData.json";
import { useNavigate } from 'react-router-dom';

const FacultyTable = () => {
    const faculties = data.faculties;

    const handleEdit = (id) => {
        console.log("Edit Subject", id);
    }

    const handleDelete = (id) => {
        console.log("Delete Subject", id);
    }

    const handleAddNewSubject = () => {
        console.log("Add New Subject");
    }

    const navigate = useNavigate();

    return (

        <>
            <div className="bg-slate-800 text-white">
                <div className="max-w-7xl mx-auto px-16 py-4 flex justify-around items-center">
                    <h1 className="text-3xl font-bold leading-tight">
                        IIPS Timetable Management<br />System
                    </h1>
                    <button className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-slate-800 transition" onClick={() => navigate("/dashboard")}>
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-gray-100 px-16 py-2 text-sm ">
                    <span className="text-black font-semibold mr-4">Admin Panel</span>
                    <span className="text-gray-500" >Dashboard</span>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-10 p-4">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="flex justify-between items-center bg-gray-100 px-6 py-3 border-b">
                        <h2 className="text-lg font-semibold">Manage Faculty</h2>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded" onClick={handleAddNewSubject}>
                            Add New Faculty
                        </button>
                    </div>

                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-slate-800 text-white text-left">
                                <th className="px-6 py-2 font-medium">Name</th>
                                <th className="px-6 py-2 font-medium">Desigination</th>
                                <th className="px-6 py-2 font-medium">Department</th>
                                <th className="px-6 py-2 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {faculties.map((faculty, index) => (
                                <tr key={faculty.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                                    <td className="px-6 py-2">{faculty.name}</td>
                                    <td className="px-6 py-2">{faculty.designation}</td>
                                    <td className="px-6 py-2">{faculty.department}</td>
                                    <td className="px-6 py-2">
                                        <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm mr-2" onClick={handleEdit}>
                                            Edit
                                        </button>
                                        <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm" onClick={handleDelete}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default FacultyTable;