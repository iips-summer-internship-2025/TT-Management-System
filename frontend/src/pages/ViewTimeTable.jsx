import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, X, Check, AlertTriangle, Users, BookOpen, Clock, MapPin } from 'lucide-react';
import academicData from "../assets/academicData.json";

function ViewTimeTable() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [selectedFaculty, setSelectedFaculty] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  // Sample attendance data - replace with your actual data source
  const attendanceData = {
    '2025-05-01': [
      {
        id: 'class-1',
        facultyId: 'dr-smith',
        subjectId: 'csc201',
        courseId: 'btech-cs-a',
        semester: '3',
        roomId: 'room-101',
        timeSlot: '09:00-10:00',
        day: 'Thursday',
        taken: true,
        studentsPresent: 65,
        totalStudents: 70
      },
      {
        id: 'class-2',
        facultyId: 'dr-brown',
        subjectId: 'it201',
        courseId: 'btech-it-a',
        semester: '3',
        roomId: 'room-102',
        timeSlot: '10:00-11:00',
        day: 'Thursday',
        taken: false,
        studentsPresent: 0,
        totalStudents: 65
      },
      {
        id: 'class-3',
        facultyId: 'prof-green',
        subjectId: 'mca501',
        courseId: 'mca-sec-a',
        semester: '5',
        roomId: 'room-201',
        timeSlot: '11:00-12:00',
        day: 'Thursday',
        taken: true,
        studentsPresent: 58,
        totalStudents: 60
      }
    ],
    '2025-05-15': [
      {
        id: 'class-4',
        facultyId: 'dr-smith',
        subjectId: 'csc202',
        courseId: 'btech-cs-a',
        semester: '4',
        roomId: 'room-101',
        timeSlot: '09:00-10:00',
        day: 'Thursday',
        taken: true,
        studentsPresent: 68,
        totalStudents: 70
      },
      {
        id: 'class-5',
        facultyId: 'prof-white',
        subjectId: 'csc301',
        courseId: 'btech-cs-b',
        semester: '5',
        roomId: 'room-202',
        timeSlot: '10:00-11:00',
        day: 'Thursday',
        taken: true,
        studentsPresent: 66,
        totalStudents: 70
      },
      {
        id: 'class-6',
        facultyId: 'dr-brown',
        subjectId: 'it301',
        courseId: 'btech-it-b',
        semester: '6',
        roomId: 'lab-301',
        timeSlot: '14:00-15:00',
        day: 'Thursday',
        taken: false,
        studentsPresent: 0,
        totalStudents: 65
      }
    ],
    '2025-05-20': [
      {
        id: 'class-7',
        facultyId: 'dr-johnson',
        subjectId: 'mth201',
        courseId: 'btech-cs-a',
        semester: '3',
        roomId: 'room-103',
        timeSlot: '09:00-10:00',
        day: 'Tuesday',
        taken: false,
        studentsPresent: 0,
        totalStudents: 70
      },
      {
        id: 'class-8',
        facultyId: 'prof-green',
        subjectId: 'mca502',
        courseId: 'mca-sec-a',
        semester: '6',
        roomId: 'room-201',
        timeSlot: '11:00-12:00',
        day: 'Tuesday',
        taken: true,
        studentsPresent: 55,
        totalStudents: 60
      },
      {
        id: 'class-9',
        facultyId: 'prof-anderson',
        subjectId: 'mca501',
        courseId: 'mca-sec-b',
        semester: '5',
        roomId: 'room-108',
        timeSlot: '15:00-16:00',
        day: 'Tuesday',
        taken: true,
        studentsPresent: 59,
        totalStudents: 60
      }
    ]
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getClassesForDate = (date) => {
    const dateKey = formatDateKey(date);
    return attendanceData[dateKey] || [];
  };

  const getFilteredClasses = (classes) => {
    let filtered = [...classes];

    if (selectedCourse !== 'all') {
      filtered = filtered.filter(cls => cls.courseId === selectedCourse);
    }

    if (selectedFaculty !== 'all') {
      filtered = filtered.filter(cls => cls.facultyId === selectedFaculty);
    }

    if (selectedSemester !== 'all') {
      filtered = filtered.filter(cls => cls.semester === selectedSemester);
    }

    return filtered;
  };

  const getAttendanceStatus = (date) => {
    const classes = getFilteredClasses(getClassesForDate(date));
    
    if (classes.length === 0) return 'no-data';
    
    const takenCount = classes.filter(cls => cls.taken).length;
    const totalCount = classes.length;
    
    if (takenCount === totalCount) return 'all-present';
    if (takenCount === 0) return 'all-absent';
    return 'partial';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showModal]);

  // Helper functions to get data by ID
  const getFacultyById = (id) => academicData.faculties.find(f => f.id === id);
  const getSubjectById = (id) => academicData.subjects.find(s => s.id === id);
  const getCourseById = (id) => academicData.courses.find(c => c.id === id);
  const getRoomById = (id) => academicData.rooms.find(r => r.id === id);
  const getSemesterById = (id) => academicData.semesters.find(s => s.id === id);

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const selectedDateClasses = selectedDate ? getFilteredClasses(getClassesForDate(selectedDate)) : [];

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
                <label className="text-sm font-medium text-gray-600 mb-1">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                >
                  <option value="all">All Courses</option>
                  {academicData.courses.map(course => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Faculty</label>
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[150px]"
                >
                  <option value="all">All Faculty</option>
                  {academicData.faculties.map(faculty => (
                    <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-600 mb-1">Semester</label>
                <select
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[120px]"
                >
                  <option value="all">All Semesters</option>
                  {academicData.semesters.map(semester => (
                    <option key={semester.id} value={semester.id}>Semester {semester.name}</option>
                  ))}
                </select>
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
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-sm text-gray-600">Partial Attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-sm text-gray-600">Classes Missed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm text-gray-600">No Classes Scheduled</span>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="p-3 text-center font-semibold text-gray-600 bg-gray-100">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-3 h-16"></div>;
              }
              
              const status = getAttendanceStatus(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const classCount = getFilteredClasses(getClassesForDate(day)).length;
              
              let bgColor = 'bg-white hover:bg-gray-50';
              let indicator = '';
              
              switch (status) {
                case 'all-present':
                  indicator = 'bg-green-500';
                  break;
                case 'partial':
                  indicator = 'bg-yellow-500';
                  break;
                case 'all-absent':
                  indicator = 'bg-red-500';
                  break;
                case 'no-data':
                  indicator = 'bg-gray-300';
                  break;
              }
              
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => handleDateClick(day)}
                  className={`p-3 h-16 border cursor-pointer transition-all duration-200 ${bgColor} hover:shadow-md relative ${
                    isToday ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className={`text-sm font-medium ${isToday ? 'text-blue-600 font-bold' : 'text-gray-700'}`}>
                      {day.getDate()}
                    </span>
                    {status !== 'no-data' && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2 h-2 rounded-full ${indicator}`}></div>
                        {classCount > 0 && (
                          <span className="text-xs text-gray-500">{classCount}</span>
                        )}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            ref={modalRef}
            className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800">
                  Class Attendance - {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
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
              {selectedDateClasses.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No classes scheduled for this date with the current filters.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedDateClasses.map((classData) => {
                    const faculty = getFacultyById(classData.facultyId);
                    const subject = getSubjectById(classData.subjectId);
                    const course = getCourseById(classData.courseId);
                    const room = getRoomById(classData.roomId);
                    const semester = getSemesterById(classData.semester);
                    
                    return (
                      <div
                        key={classData.id}
                        className={`p-6 rounded-lg border-l-4 ${
                          classData.taken 
                            ? 'bg-green-50 border-green-500' 
                            : 'bg-red-50 border-red-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {classData.taken ? (
                                <Check className="w-6 h-6 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                              )}
                              <h4 className="text-lg font-semibold text-gray-800">
                                {subject?.name || 'Unknown Subject'} ({subject?.code})
                              </h4>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Users className="w-4 h-4" />
                                  <span><strong>Faculty:</strong> {faculty?.name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <BookOpen className="w-4 h-4" />
                                  <span><strong>Course:</strong> {course?.name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <span><strong>Semester:</strong> {semester?.name || classData.semester}</span>
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span><strong>Time:</strong> {classData.timeSlot}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span><strong>Room:</strong> {room?.name || 'Unknown'}</span>
                                </div>
                                {classData.taken && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="w-4 h-4" />
                                    <span><strong>Attendance:</strong> {classData.studentsPresent}/{classData.totalStudents} students</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className={`px-4 py-2 rounded-full text-sm font-medium ml-4 ${
                            classData.taken 
                              ? 'bg-green-200 text-green-800' 
                              : 'bg-red-200 text-red-800'
                          }`}>
                            {classData.taken ? 'Class Taken' : 'Class Missed'}
                          </div>
                        </div>
                        
                        {faculty && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-sm text-gray-600">
                              <strong>Department:</strong> {faculty.department} | 
                              <strong> Designation:</strong> {faculty.designation} |
                              <strong> Specialization:</strong> {faculty.specialization?.join(', ') || 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ViewTimeTable;