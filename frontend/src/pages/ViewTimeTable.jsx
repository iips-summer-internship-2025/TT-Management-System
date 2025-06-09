import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  X,
  Check,
  AlertTriangle,
  Users,
  BookOpen,
  Clock,
  MapPin,
} from "lucide-react";
import academicData from "../assets/academicData.json";

function ViewTimeTable() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(false);
  //use that useState variable attendanceData to store the response which comes from below api
  //GET /api/v1/calendar?course_id={courseId}&semester={semesterId}&month={month}&year={year}&faculty_id={facultyId}
  // const [attendanceData, setAttendanceData] = useState(null);
  const modalRef = useRef(null);

  const attendanceData = {
    data: [
      {
        date: "2025-05-25",
        total_held: 2,
        total_cancelled: 1,
        no_data: 5,
      },
      {
        date: "2025-05-26",
        total_held: 1,
        total_cancelled: 0,
        no_data: 3,
      },
      {
        date: "2025-05-27",
        total_held: 3,
        total_cancelled: 2,
        no_data: 2,
      },
      {
        date: "2025-05-28",
        total_held: 0,
        total_cancelled: 1,
        no_data: 6,
      },
      {
        date: "2025-05-29",
        total_held: 2,
        total_cancelled: 0,
        no_data: 4,
      },
      {
        date: "2025-05-30",
        total_held: 1,
        total_cancelled: 0,
        no_data: 3,
      },
      {
        date: "2025-05-31",
        total_held: 3,
        total_cancelled: 1,
        no_data: 2,
      },
      {
        date: "2025-06-01",
        total_held: 2,
        total_cancelled: 0,
        no_data: 4,
      },
      {
        date: "2025-06-02",
        total_held: 0,
        total_cancelled: 1,
        no_data: 5,
      },
      {
        date: "2025-06-03",
        total_held: 1,
        total_cancelled: 2,
        no_data: 2,
      },
      {
        date: "2025-06-04",
        total_held: 2,
        total_cancelled: 0,
        no_data: 3,
      },
      {
        date: "2025-06-05",
        total_held: 3,
        total_cancelled: 1,
        no_data: 2,
      },
      {
        date: "2025-06-06",
        total_held: 1,
        total_cancelled: 0,
        no_data: 4,
      },
      {
        date: "2025-06-07",
        total_held: 1,
        total_cancelled: 0,
        no_data: 4,
      },
      {
        date: "2025-06-08",
        total_held: 1,
        total_cancelled: 0,
        no_data: 3,
      },
    ],
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split("T")[0];
  };

  const getClassesForDate = (date) => {
    const dateKey = formatDateKey(date);
    const dateData = attendanceData.data.find((item) => item.date === dateKey);

    if (!dateData) return { total_held: 0, total_cancelled: 0, no_data: 0 };

    return {
      total_held: dateData.total_held,
      total_cancelled: dateData.total_cancelled,
      no_data: dateData.no_data,
    };
  };

  const handleApplyFilters = () => {
    setAppliedFilters(true);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showModal]);

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="w-8 h-8 text-blue-600" />
              Faculty Attendance Calendar
            </h1>

            <div className="flex flex-wrap gap-4 lg:ml-auto">
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                >
                  <option value="all">All Courses</option>
                  {academicData.courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Faculty
                </label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                >
                  <option value="all">All Faculty</option>
                  {academicData.faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">
                  Semester
                </label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
                >
                  <option value="all">All Semesters</option>
                  {academicData.semesters.map((semester) => (
                    <option key={semester.id} value={semester.id}>
                      Semester {semester.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col justify-end">
                <button
                  onClick={handleApplyFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <h2 className="text-2xl font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>

            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-sm text-gray-600">Classes Taken</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Classes Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">
                No Classes Scheduled
              </span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map((day) => (
              <div
                key={day}
                className="p-3 text-center font-semibold text-gray-600 bg-gray-100"
              >
                {day}
              </div>
            ))}

            {/* Calendar days */}
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-3 h-16"></div>;
              }

              const classesData = getClassesForDate(day);
              const isToday = day.toDateString() === new Date().toDateString();

              let bgColor = "bg-white hover:bg-gray-50";
              let indicator = "";
              let statusText = "";

              if (
                classesData.total_held > 0 ||
                classesData.total_cancelled > 0
              ) {
                if (classesData.total_cancelled === 0) {
                  indicator = "bg-green-500";
                  statusText = `${classesData.total_held} held`;
                } else if (classesData.total_held === 0) {
                  indicator = "bg-red-500";
                  statusText = `${classesData.total_cancelled} missed`;
                } else {
                  indicator = "bg-yellow-500";
                  statusText = `${classesData.total_held} held, ${classesData.total_cancelled} missed`;
                }
              } else {
                indicator = "bg-gray-300";
                statusText = "No classes";
              }

              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`p-3 h-16 border cursor-pointer transition-all duration-200 ${bgColor} hover:shadow-md relative ${
                    isToday ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span
                      className={`text-sm font-medium ${
                        isToday ? "text-blue-600 font-bold" : "text-gray-700"
                      }`}
                    >
                      {day.getDate()}
                    </span>

                    {appliedFilters && (
                      <div className="flex flex-col items-center mt-1">
                        <div className="flex items-center gap-1">
                          <div
                            className={`w-2 h-2 rounded-full ${indicator}`}
                          ></div>

                          <span className="text-xs text-gray-500">
                            {statusText}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  Class Attendance -{" "}
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Attendance Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      <span className="font-medium">Classes Held</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-green-600">
                      {getClassesForDate(selectedDate).total_held}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <X className="w-5 h-5 text-red-500" />
                      <span className="font-medium">Classes Missed</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-red-600">
                      {getClassesForDate(selectedDate).total_cancelled}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <span className="font-medium">Total Scheduled</span>
                    </div>
                    <p className="text-2xl font-bold mt-2 text-gray-600">
                      {getClassesForDate(selectedDate).total_held +
                        getClassesForDate(selectedDate).total_cancelled}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-800 mb-2">
                    Current Filters
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <span className="text-sm text-gray-600">Course: </span>
                      <span className="text-sm font-medium">
                        {selectedCourse === "all"
                          ? "All"
                          : academicData.courses.find(
                              (c) => c.id === selectedCourse
                            )?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Faculty: </span>
                      <span className="text-sm font-medium">
                        {selectedFaculty === "all"
                          ? "All"
                          : academicData.faculties.find(
                              (f) => f.id === selectedFaculty
                            )?.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Semester: </span>
                      <span className="text-sm font-medium">
                        {selectedSemester === "all"
                          ? "All"
                          : `Semester ${selectedSemester}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTimeTable;
