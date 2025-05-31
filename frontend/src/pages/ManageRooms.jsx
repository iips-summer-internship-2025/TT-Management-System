import React from 'react'
import data from "../assets/academicData.json";
import { useNavigate } from 'react-router-dom';

function ManageRooms() {
  const rooms = data.rooms;

    const handleEdit = (id) => {
    console.log("Edit Rooms", id);
  }

  const handleDelete = (id) => {
    console.log("Delete Rooms", id);
  }

  const handleAddNewRoom = () => {
    console.log("Add New Rooms");
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


      <div className="max-w-7xl mx-auto p-6 ">
          <div className="flex justify-between items-center mb-6 ">
            <h2 className="text-2xl font-semibold">Manage Rooms</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded" onClick={handleAddNewRoom}>
              Add New Room
            </button>
          </div>

          
            <div className="flex flex-wrap gap-[25px] justify-center mt-15">
           
              {rooms.map((room, index) => (
               <div
              key={index}
              className="w-[200px] h-[200px] bg-gradient-to-br from-white via-blue-50 to-white rounded-2xl border border-gray-200 shadow-lg p-4 flex flex-col justify-between transform transition duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div>
                <p className="text-sm text-gray-500 font-semibold">
                  ID: {room.id}
                </p>
                <p className="text-lg mt-1 text-gray-800 font-medium line-clamp-2">
                  {room.name}
                </p>
              </div>

              <div className="mt-auto flex justify-between">
                <button className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold px-3 py-1.5 rounded-lg text-sm border border-cyan-700 shadow-md hover:shadow-lg hover:from-teal-600 hover:to-cyan-700 focus:outline-none" onClick={handleEdit}>
                  Edit
                </button>

                <button className="bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold px-3 py-1.5 rounded-lg text-sm border border-rose-700 shadow-md hover:shadow-lg hover:from-red-600 hover:to-rose-600 focus:outline-none" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
              ))}
           
        </div>
      

 </div>
    </>
  );
};

export default ManageRooms;