import React from "react";
import data from "../assets/academicData.json";
import { useNavigate } from 'react-router-dom';

function ManageBatches() {
   const batches = data.batches;

  const handleEdit = (id) => {
    console.log("Edit Batch", id);
  }

  const handleDelete = (id) => {
    console.log("Delete Batch", id);
  }

  const handleAddNewBatches = () => {
    console.log("Add New Batch");
  }
  
  const navigate=useNavigate();

  return (
    <>
     <div className="bg-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-16 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold leading-tight">
              IIPS Timetable Management <br />
              System
            </h1>
          </div>

          <button 
            className="border border-white text-white px-5 py-2 rounded hover:bg-white hover:text-[#2c3e50] transition" 
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </button>
        </div>

        <div className="bg-gray-100 text-black">
          <div className="max-w-7xl mx-auto px-16 py-3 text-sm">
            <span className="font-semibold">Admin Panel</span>
            <span className="text-gray-400 ml-4">Dashboard</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-10 p-4">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-100 px-6 py-3 border-b">
          <h2 className="text-lg font-semibold">Manage Batches</h2>
          <button className="bg-blue-500 hover:bg-blue-600 text-white " onClick={handleAddNewBatches}> //text-sm px-4 py-2 rounded
            Add New Batches
          </button>
        </div>

        <table className="w-full table-auto">
          <thead>
            <tr className="bg-slate-800 text-white text-left">
              {/* <th className="px-6 py-2 font-medium">ID</th> */}
              <th className="px-6 py-2 font-medium">Name</th>
               <th className="px-6 py-2 font-medium">Year</th>
                <th className="px-6 py-2 font-medium">Department</th>
              <th className="px-6 py-2 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch, index) => (
              <tr key={batch.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                {/* <td className="px-6 py-2">{batch.id}</td> */}
                <td className="px-6 py-2">{batch.name}</td>
                <td className="px-6 py-2">{batch.year}</td>
                <td className="px-6 py-2">{batch.department}</td>
                <td className="px-6 py-2">
                  <button className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm mr-2 inline-flex items-center" onClick={handleEdit}>
                    Edit
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm inline-flex items-center" onClick={handleDelete}>
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

export default ManageBatches;
