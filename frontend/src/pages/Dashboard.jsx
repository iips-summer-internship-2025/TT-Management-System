import { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Heading from "../components/Heading";
import { MdGroups } from "react-icons/md";
import { FaBook, FaDoorOpen, FaPlus, FaEdit, FaUserTie, FaSpinner, FaExclamationTriangle } from "react-icons/fa";
import { FaTableCells } from "react-icons/fa6";
import data from "../assets/academicData.json";
// import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({
    faculties: 0,
    subjects: 0,
    rooms: 0,
    courses: 0
  });

  const API_BASE_URL = "http://localhost:8080/api/v1";
  const API_ENDPOINTS = {
    FACULTY_COUNT: `${API_BASE_URL}/faculty`,
    SUBJECT_COUNT: `${API_BASE_URL}/subject`,
    ROOM_COUNT: `${API_BASE_URL}/room`,
    COURSE_COUNT: `${API_BASE_URL}/course`
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all counts in parallel
        const responses = await Promise.all([
          fetch(API_ENDPOINTS.FACULTY_COUNT),
          fetch(API_ENDPOINTS.SUBJECT_COUNT),
          fetch(API_ENDPOINTS.ROOM_COUNT),
          fetch(API_ENDPOINTS.COURSE_COUNT)
        ]);

        // Check for errors
        for (const response of responses) {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }

        // Parse all responses
        const [facultyData, subjectData, roomData, courseData] = await Promise.all([
          responses[0].json(),
          responses[1].json(),
          responses[2].json(),
          responses[3].json()
        ]);

        // console.log('Fetched data:', { facultyData, subjectData, roomData, courseData });

        // Handle both array responses and object responses with count property
        const getCount = (data) => {
          if (Array.isArray(data)) {
            return data.length;
          } else if (data && typeof data === 'object') {
            return data.count || data.total || data.length || 0;
          }
          return 0;
        };

        setCounts({
          faculties: getCount(facultyData),
          subjects: getCount(subjectData),
          rooms: getCount(roomData),
          courses: getCount(courseData)
        });

        // console.log("Final counts:", {
        //   faculties: getCount(facultyData),
        //   subjects: getCount(subjectData), 
        //   rooms: getCount(roomData),
        //   courses: getCount(courseData)
        // });

      } catch (err) {
        console.error('Error fetching counts:', err);
        setError('Failed to load dashboard data. Please check your connection and try again.');
        // Set default values on error
        setCounts({
          faculties: 0,
          subjects: 0,
          rooms: 0,
          courses: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);
  const { logout } = useAuth();

  const statsCards = [
    {
      heading: loading ? <FaSpinner className="animate-spin" /> : counts.faculties,
      title: "Faculty Members",
      icon: MdGroups,
      iconColor: "bg-emerald-500",
      bgGradient: "from-emerald-50 to-emerald-100",
    },
    {
      heading: loading ? <FaSpinner className="animate-spin" /> : counts.subjects,
      title: "Subjects",
      icon: FaBook,
      iconColor: "bg-orange-500",
      bgGradient: "from-orange-50 to-orange-100",
    },
    {
      heading: loading ? <FaSpinner className="animate-spin" /> : counts.rooms,
      title: "Rooms",
      icon: FaDoorOpen,
      iconColor: "bg-rose-500",
      bgGradient: "from-rose-50 to-rose-100"
    },
    {
      heading: loading ? <FaSpinner className="animate-spin" /> : counts.courses,
      title: "Courses",
      icon: FaEdit,
      iconColor: "bg-blue-500",
      bgGradient: "from-blue-50 to-blue-100"
    }
  ];

  const actionCards = [
    {
      title: "Create Table",
      description: "Create new timetable schedules",
      icon: FaPlus,
      iconColor: "bg-blue-500",
      hoverColor: "hover:bg-blue-50",
      route: "/create-timetable",
    },
    {
      title: "View Tables",
      description: "View existing timetables",
      icon: FaTableCells,
      iconColor: "bg-emerald-500",
      hoverColor: "hover:bg-emerald-50",
      route: "/view-timetable",
    },
    {
      title: "Manage Courses",
      description: "View existing courses",
      icon: FaEdit,
      iconColor: "bg-amber-500",
      hoverColor: "hover:bg-amber-50",
      route: "/manage-courses",
    },
    {
      title: "Manage Subjects",
      description: "Add, edit or remove subjects",
      icon: FaBook,
      iconColor: "bg-orange-500",
      hoverColor: "hover:bg-orange-50",
      route: "/manage-subjects",
    },
    {
      title: "Manage Rooms",
      description: "Configure room availability",
      icon: FaDoorOpen,
      iconColor: "bg-purple-500",
      hoverColor: "hover:bg-purple-50",
      route: "/manage-rooms",
    },
    {
      title: "Manage Faculty",
      description: "Handle faculty information",
      icon: FaUserTie,
      iconColor: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-50",
      route: "/manage-faculty",
    },
  ];

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavBar onLogout={logout} />
      {/* <NavBar  /> */}

      {/* Header Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <Heading text="Admin Dashboard" />
        <p className="text-center text-slate-600 mt-2 text-sm sm:text-base">
          Manage your academic scheduling system efficiently
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="px-4 sm:px-6 lg:px-8 pb-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
            <FaExclamationTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r ${card.bgGradient} rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-white/50`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-slate-800 mb-1">
                    {card.heading}
                  </p>
                  <p className="text-slate-600 text-sm font-medium">
                    {card.title}
                  </p>
                </div>
                <div className={`${card.iconColor} p-3 rounded-lg shadow-sm`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Quick Actions
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Access frequently used management tools
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
          {actionCards.map((card, index) => (
            <div
              key={index}
              onClick={() => navigate(card.route)}
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-slate-200 ${card.hoverColor} group`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`${card.iconColor} p-3 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200`}
                >
                  <card.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-slate-900">
                    {card.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>

              {/* Hover indicator */}
              <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="text-slate-400 text-xs flex items-center">
                  Click to access
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
