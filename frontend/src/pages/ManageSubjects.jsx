import React from "react";
import data from "../assets/academicData.json";

const SubjectsTable = () => {
  return (
    <>

    <div className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-16 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold leading-tight">
          IIPS Timetable Management<br />System
        </h1>
        <button className="border border-white text-white px-4 py-1 rounded hover:bg-white hover:text-slate-800 transition">
          Back to Dashboard
        </button>
      </div>

      <div className="bg-gray-100 px-22 py-2 text-sm">
        <span className="text-black font-semibold mr-4">Admin Panel</span>
        <span className="text-gray-500" >Dashboard</span>
      </div>
    </div>

    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg max-w-6xl mx-auto">
        <div className="bg-gray-200 px-6 py-4 rounded-t-lg border-b flex flex-row justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Manage Subjects</h1>
           <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded">
            Add New Subject
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Faculty</th>
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.subjects.map((subject) => (
                <tr key={subject.id}>
                  <td className="px-4 py-3">{subject.name}</td>
                  <td className="px-4 py-3">{subject.subject_code}</td>
                  <td className="px-4 py-3">{subject.faculty}</td>
                  <td className="px-4 py-3">{subject.semesters}</td>
                  <td className="px-4 py-3 space-x-2">
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                      Edit
                    </button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
    </>
  );
};

export default SubjectsTable;