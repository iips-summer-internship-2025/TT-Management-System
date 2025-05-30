import React from 'react'
import data from "../assets/academicData.json";
import { useNavigate } from 'react-router-dom';

function ManageRooms() {
  const rooms = data.rooms;

    const handleEdit = (id) => {
    console.log("Edit Subject", id);
  }

  const handleDelete = (id) => {
    console.log("Delete Subject", id);
  }

  const handleAddNewRoom = () => {
    console.log("Add New Subject");
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

          <button className="border border-white text-white px-5 py-2 rounded hover:bg-white hover:text-[#2c3e50] transition" onClick={()=>navigate("/dashboard")}>
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
        <div className="bg-white shadow overflow-hidden">
          <div className="flex justify-between items-center bg-gray-100 px-6 py-3 border-b">
            <h2 className="text-lg font-semibold">Manage Rooms</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded" onClick={handleAddNewRoom}>
              Add New Room
            </button>
          </div>

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-800 text-white text-left">
                <th className="px-6 py-2 font-medium">Room Name</th>
                <th className="px-6 py-2 font-medium">floor</th>
                <th className="px-6 py-2 font-medium">Capacity</th>
                <th className="px-6 py-2 font-medium">Type</th>
                <th className="px-6 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={room.id} className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                  <td className="px-6 py-2">{room.name}</td>
                  <td className="px-6 py-2">{room.floor}</td>
                  <td className="px-6 py-2">{room.capacity}</td>
                  <td className="px-6 py-2">{room.type}</td>
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

export default ManageRooms;