import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  AlertTriangle,
  Users,
  BookOpen,
  ArrowLeft,
  Clock,
  MapPin,
} from "lucide-react";

const Spinner = ({ className = "w-12 h-12" }) => (
  <svg
    className={`animate-spin text-blue-500 ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

const FilterSelect = React.memo(({ label, value, options, onChange }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-gray-600 mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 bg-white shadow-sm min-w-[180px]"
    >
      {options}
    </select>
  </div>
));

const TimeSlot = ({ lecture }) => {
  if (!lecture) return <div className="h-full p-3 bg-gray-50/50 border-b border-r border-gray-200" />;

  return (
    <div className={`h-full p-3 border-b border-r border-gray-200 ${lecture.status === 'held' ? 'bg-green-50' : lecture.status === 'cancelled' ? 'bg-red-50' : 'bg-yellow-50'}`}>
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 text-sm">{lecture.subject}</h4>
            <p className="text-xs text-gray-600">{lecture.faculty}</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${lecture.status === 'held' ? 'bg-green-500' : lecture.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-400'}`}></div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>Room {lecture.room}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>Batch {lecture.batch}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function ClassTimeTable() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filters
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedFaculty, setSelectedFaculty] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  
  // API data
  const [faculties, setFaculties] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [batches, setBatches] = useState([]);
  
  const API_BASE_URL = "http://localhost:8080/api/v1";
  const API_ENDPOINTS = {
    FACULTY: `${API_BASE_URL}/faculty`,
    ROOM: `${API_BASE_URL}/room`,
    BATCH: `${API_BASE_URL}/batch`,
    TIMETABLE_DATA: `${API_BASE_URL}/timetable-data`, // Changed from /timetable
  };

  // Days of the week
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  
  // Time slots (1PM to 5PM as per reference image)
  const timeSlots = useMemo(() => {
    return [
      "9:00-10:00",
      "11:00-12:00",
      "12:00-1:00",
      "1:00-2:00",
      "2:00-3:00",
      "3:00-4:00",
      "4:00-5:00"
    ];
  }, []);

  // Generate date range for the current week
  const weekDates = useMemo(() => {
    const startOfWeek = new Date(currentWeek);
    startOfWeek.setDate(currentWeek.getDate() - currentWeek.getDay() + (currentWeek.getDay() === 0 ? -6 : 1));
    
    return days.map((_, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return date;
    });
  }, [currentWeek]);

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        // Fetch faculties
        const facultyResponse = await fetch(API_ENDPOINTS.FACULTY, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!facultyResponse.ok) throw new Error('Failed to fetch faculties');
        const facultyData = await facultyResponse.json();
        setFaculties(Array.isArray(facultyData) ? facultyData : []);
        
        // Fetch rooms
        const roomResponse = await fetch(API_ENDPOINTS.ROOM, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!roomResponse.ok) throw new Error('Failed to fetch rooms');
        const roomData = await roomResponse.json();
        setRooms(Array.isArray(roomData) ? roomData : []);
        
        // Fetch batches
        const batchResponse = await fetch(API_ENDPOINTS.BATCH, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        if (!batchResponse.ok) throw new Error('Failed to fetch batches');
        const batchData = await batchResponse.json();
        setBatches(Array.isArray(batchData) ? batchData : []);
        
      } catch (err) {
        setError(err.message);
        console.error('Error fetching filter options:', err);
      }
    };
    
    fetchFilterOptions();
  }, []);

  // Fetch timetable data
  useEffect(() => {
    const fetchTimetableData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const params = new URLSearchParams({
          start_date: weekDates[0].toISOString().split('T')[0],
          end_date: weekDates[5].toISOString().split('T')[0]
        });
        
        if (selectedRoom !== "all") params.append('room_id', selectedRoom);
        if (selectedFaculty !== "all") params.append('faculty_id', selectedFaculty);
        if (selectedBatch !== "all") params.append('batch_id', selectedBatch);
        
        const response = await fetch(`${API_ENDPOINTS.TIMETABLE_DATA}?${params}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });
        
        if (!response.ok) throw new Error('Failed to fetch timetable');
        const data = await response.json();
        
        setTimetable(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching timetable data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTimetableData();
  }, [currentWeek, selectedRoom, selectedFaculty, selectedBatch]);

  // Handle filter changes
  const handleFilterChange = (type, value) => {
    switch (type) {
      case 'room':
        setSelectedRoom(value);
        break;
      case 'faculty':
        setSelectedFaculty(value);
        break;
      case 'batch':
        setSelectedBatch(value);
        break;
      default:
        break;
    }
  };

  // Navigation functions
  const handlePrevWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() - 7)));
  };

  const handleNextWeek = () => {
    setCurrentWeek(new Date(currentWeek.setDate(currentWeek.getDate() + 7)));
  };

  const handleThisWeek = () => {
    setCurrentWeek(new Date());
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  // Get lecture for specific day and time slot
  const getLectureForSlot = (dayIndex, timeSlotIndex) => {
    const day = days[dayIndex];
    const time = timeSlots[timeSlotIndex];
    
    return timetable.find(lecture => 
      lecture.day === day && 
      lecture.time_slot === time
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
        <Spinner />
        <p className="mt-4 text-lg text-gray-600">Loading Timetable...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>

            <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-800 flex items-center gap-2 sm:gap-3">
              Class Timetable
            </h1>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <FilterSelect
                label="Room"
                value={selectedRoom}
                onChange={(e) => handleFilterChange('room', e.target.value)}
                options={
                  <>
                    <option value="all">All Rooms</option>
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </>
                }
              />

              <FilterSelect
                label="Faculty"
                value={selectedFaculty}
                onChange={(e) => handleFilterChange('faculty', e.target.value)}
                options={
                  <>
                    <option value="all">All Faculties</option>
                    {faculties.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </>
                }
              />

              <FilterSelect
                label="Batch"
                value={selectedBatch}
                onChange={(e) => handleFilterChange('batch', e.target.value)}
                options={
                  <>
                    <option value="all">All Batches</option>
                    {batches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </>
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrevWeek}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button 
                onClick={handleThisWeek}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                This Week
              </button>
              <button 
                onClick={handleNextWeek}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors duration-300"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 tracking-wide">
              Week of {formatDate(weekDates[0])} - {formatDate(weekDates[5])}
            </h2>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs">Held</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-xs">Cancelled</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-xs">No Entry</span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="bg-gray-100 p-3 font-semibold text-gray-700 text-left border-r border-b border-gray-200 w-32">
                Day/Time
              </th>
              {timeSlots.map((time) => (
                <th 
                  key={time} 
                  className="bg-gray-100 p-3 font-semibold text-gray-700 text-center border-r border-b border-gray-200 last:border-r-0"
                >
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIndex) => (
              <tr key={day}>
                <td className="bg-gray-50 p-3 font-medium text-gray-700 text-sm border-r border-b border-gray-200">
                  <div className="font-semibold">{day}</div>
                  <div className="text-xs text-gray-500">
                    {formatDate(weekDates[dayIndex])}
                  </div>
                </td>
                {timeSlots.map((time, timeIndex) => (
                  <td key={`${day}-${time}`} className="p-0">
                    <TimeSlot 
                      lecture={getLectureForSlot(dayIndex, timeIndex)} 
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
          
          {timetable.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold">No Classes Scheduled</h3>
              <p>There is no class data available for this week with the current filters.</p>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="fixed bottom-5 right-5 mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg flex items-center animate-fade-in">
          <AlertTriangle className="w-6 h-6 mr-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default ClassTimeTable;