import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import academicData from "../assets/academicData.json";

const CreateTable = () => {
  const [gridData, setGridData] = useState({});
  const [selectedCell, setSelectedCell] = useState(null);
  const [dialogData, setDialogData] = useState({ subject: "", code: "", faculty: "" });
  const [showTimetable, setShowTimetable] = useState(false);
  const [batchDetails, setBatchDetails] = useState({
    course: "",
    batch: "",
    semester: "",
  });
  const [isLocked, setIsLocked] = useState(false);
  const [timeSlots, setTimeSlots] = useState([...academicData.timeSlots]);
  const [showAddTimeSlotDialog, setShowAddTimeSlotDialog] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [editTimeSlotDialog, setEditTimeSlotDialog] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState({ index: -1, value: "" });

  // API Data States

  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);

  const API_BASE_URL = "http://localhost:8080/api/v1";
  const API_ENDPOINTS = {
    GET_COURSE: `${API_BASE_URL}/course`,
    GET_BATCH: `${API_BASE_URL}/batch`,
    GET_SEMESTER: `${API_BASE_URL}/semester`,
    GET_SUBJECT: `${API_BASE_URL}/subject`,
    GET_FACULTY: `${API_BASE_URL}/faculty`,
  };

  // Fetch data from APIs
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchCourses(),
        fetchBatches(),
        fetchSubjects(),
        fetchFaculties()
      ]);
      // Use local semesters data
      setSemesters(academicData.semesters || []);
    } catch (err) {
      setError('Failed to fetch data from server');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_COURSE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Courses API Response:', data);
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const formatTimetableData = () => {
    // Get the selected batch details
    const selectedBatch = batches.find(batch => batch.ID.toString() === batchDetails.batch);
    const selectedCourse = courses.find(course => course.Name === batchDetails.course);

    // Transform gridData into an array of lectures/entries
    const entries = Object.keys(gridData).map(key => {
      const [day, timeSlot] = key.split('-');
      const entry = gridData[key];

      // Find the subject and faculty IDs
      const subject = subjects.find(sub => sub.Name === entry.subject);
      const faculty = faculties.find(fac => fac.Name === entry.faculty);

      return {
        day,
        timeSlot,
        subjectId: subject?.ID || null,
        facultyId: faculty?.ID || null,
        subjectName: entry.subject,
        subjectCode: entry.code,
        facultyName: entry.faculty,
        // Add any additional fields you need
      };
    });

    // Return the complete timetable structure
    return {
      batchId: selectedBatch?.ID || null,
      courseId: selectedCourse?.ID || null,
      semester: batchDetails.semester,
      entries,
      createdAt: new Date().toISOString(),
      // Add any other metadata you need
    };
  };

  const saveTimetable = async () => {
    try {
      const timetableData = formatTimetableData();
      console.log("Timetable data to be saved:", timetableData);

      const response = await fetch(`${API_BASE_URL}/lecture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(timetableData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Timetable saved successfully:', result);
      alert('Timetable saved successfully!');
      return result;
    } catch (error) {
      console.error('Error saving timetable:', error);
      alert('Failed to save timetable');
      throw error;
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_SUBJECT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Subjects API Response:', data);
      setSubjects(data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_FACULTY, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setFaculties(data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
    }
  };


  const fetchBatches = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_BATCH, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Add if using JWT
        }
      });

      // console.log("Batch API Response:", response);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Batches API Response Data:', data);

      setBatches(data);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };
  const fetchSemesters = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_SEMESTER, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Semesters API Response:', data);
      setSemesters(data);
    } catch (error) {
      console.error('Error fetching semesters:', error);
    }
  };

  // Get filtered subjects based on selected semester
  const getFilteredSubjects = () => {
    if (!batchDetails.semester) return subjects;
    const semesterNumber = parseInt(batchDetails.semester);
    return subjects.filter(subject =>
      subject.Semester === semesterNumber ||
      (subject.semesters && subject.semesters.includes(semesterNumber))
    );
  };

  // Get filtered batches based on selected course
  const getFilteredBatches = () => {
    if (!batchDetails.course) return batches;

    // Find the selected course to get its ID
    const selectedCourse = courses.find(course => course.Name === batchDetails.course);
    if (!selectedCourse) return [];

    return batches.filter(batch =>
      batch.CourseID === selectedCourse.ID
    );
  };

  // Get filtered semesters based on selected course and batch
  const getFilteredSemesters = () => {
    if (!batchDetails.course && !batchDetails.batch) return semesters;

    // You can add more complex filtering logic here based on your requirements
    return semesters.filter(semester => {
      // Example: filter semesters based on course duration or other criteria
      return true; // For now, return all semesters
    });
  };


  // Function to parse time and convert to minutes for proper sorting
  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Function to sort time slots properly
  const sortTimeSlots = (slots) => {
    return slots.sort((a, b) => {
      const [startA] = a.split('-');
      const [startB] = b.split('-');
      return parseTimeToMinutes(startA) - parseTimeToMinutes(startB);
    });
  };

  // Function to validate time slot format
  const validateTimeSlot = (timeSlot) => {
    const timeSlotRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])-([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeSlotRegex.test(timeSlot);
  };

  // Function to format time slot to 24-hour format
  const formatTimeSlot = (timeSlot) => {
    if (!validateTimeSlot(timeSlot)) return null;
    const [startTime, endTime] = timeSlot.split('-');
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  };

  // Function to check if a new time slot overlaps with existing ones
  const checkTimeSlotOverlap = (newTimeSlot, existingSlots, excludeIndex = -1) => {
    const [newStart, newEnd] = newTimeSlot.split('-');
    const newStartMinutes = parseTimeToMinutes(newStart);
    const newEndMinutes = parseTimeToMinutes(newEnd);

    // Check if end time is after start time
    if (newEndMinutes <= newStartMinutes) {
      return { hasOverlap: true, message: "End time must be after start time!" };
    }

    for (let i = 0; i < existingSlots.length; i++) {
      if (i === excludeIndex) continue; // Skip the slot being edited

      const [existingStart, existingEnd] = existingSlots[i].split('-');
      const existingStartMinutes = parseTimeToMinutes(existingStart);
      const existingEndMinutes = parseTimeToMinutes(existingEnd);

      // Check for overlap
      const hasOverlap = (
        (newStartMinutes >= existingStartMinutes && newStartMinutes < existingEndMinutes) ||
        (newEndMinutes > existingStartMinutes && newEndMinutes <= existingEndMinutes) ||
        (newStartMinutes <= existingStartMinutes && newEndMinutes >= existingEndMinutes)
      );

      if (hasOverlap) {
        return {
          hasOverlap: true,
          message: `Time slot overlaps with existing slot: ${existingSlots[i]}`
        };
      }
    }

    return { hasOverlap: false };
  };

  const days = academicData.days;

  const allDetailsSelected = () => {
    return batchDetails.course && batchDetails.batch && batchDetails.semester;
  };

  const handleCellClick = (day, time) => {
    setSelectedCell({ day, time });
    setDialogData(gridData[`${day}-${time}`] || { subject: "", code: "", faculty: "" });
  };

  const romanToInteger = (roman) => {
    // If it's already a number, return it
    if (typeof roman === 'number' || !isNaN(roman)) {
      return parseInt(roman);
    }

    const romanMap = {
      'I': 1, 'V': 5, 'X': 10, 'L': 50,
      'C': 100, 'D': 500, 'M': 1000
    };

    let result = 0;
    const romanStr = roman.toString().toUpperCase();

    for (let i = 0; i < romanStr.length; i++) {
      const current = romanMap[romanStr[i]];
      const next = romanMap[romanStr[i + 1]];

      if (next && current < next) {
        result += next - current;
        i++;
      } else {
        result += current;
      }
    }

    return result;
  };

  const handleSaveEntry = async () => {
    if (!selectedCell) return;

    try {
      // Find the selected batch
      const selectedBatch = batchDetails.batch_id;
      // console.log("Selected Batch11:", selectedBatch);
      if (!selectedBatch) throw new Error("No matching batch found");

      const selectedSubject = subjects.find(sub => sub.Name === dialogData.subject);
      if (!selectedSubject) throw new Error("No matching subject found");

      const selectedFaculty = faculties.find(fac => fac.Name === dialogData.faculty);
      if (!selectedFaculty) throw new Error("No matching faculty found");

      // Extract start and end time from the time slot
      const [startTime, endTime] = selectedCell.time.split('-');

      const semid = romanToInteger(batchDetails.semester_id || batchDetails.semester);

      const requestData = {
        DayOfWeek: selectedCell.day,
        StartTime: startTime,
        EndTime: endTime,
        SubjectID: selectedSubject.ID,
        FacultyID: selectedFaculty.ID,
        BatchID: selectedBatch,
        SemesterID: semid,
        RoomID: 1 // TODO: Make this dynamic
      };

      console.log("Sending data to server:", requestData);

      const response = await fetch(`${API_BASE_URL}/lecture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Server error details:", errorData);
        throw new Error(`Server responded with ${response.status}: ${errorData.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Entry saved successfully:', result);

      // Update local state only after successful server response
      const key = `${selectedCell.day}-${selectedCell.time}`;
      setGridData(prev => ({ ...prev, [key]: dialogData }));

    } catch (error) {
      console.error('Error saving entry:', error);
      alert(`Failed to save entry: ${error.message}`);
      return; // Don't close dialog if there's an error
    }

    setSelectedCell(null);
  };

  const handleDialogInputChange = (field, value) => {
    if (field === "subject") {
      const selectedSubject = subjects.find((sub) => sub.Name === value);
      setDialogData({
        subject: selectedSubject?.Name || "",
        code: selectedSubject?.Code || "",
        faculty: "" // Reset faculty when subject changes
      });
    } else {
      setDialogData({ ...dialogData, [field]: value });
    }
  };

  const handleGenerateTimetable = () => {
    if (allDetailsSelected()) {
      setShowTimetable(true);
      setIsLocked(true);
    }
  };

  const handleAddTimeSlot = () => {
    if (newTimeSlot.trim()) {
      const formattedTimeSlot = formatTimeSlot(newTimeSlot.trim());
      if (!formattedTimeSlot) {
        alert("Please enter a valid time slot format (e.g., 9:00-10:00 or 17:30-18:30)");
        return;
      }
      if (timeSlots.includes(formattedTimeSlot)) {
        alert("This time slot already exists!");
        return;
      }

      // Check for overlaps
      const overlapCheck = checkTimeSlotOverlap(formattedTimeSlot, timeSlots);
      if (overlapCheck.hasOverlap) {
        alert(overlapCheck.message);
        return;
      }

      const newTimeSlots = [...timeSlots, formattedTimeSlot];
      setTimeSlots(sortTimeSlots(newTimeSlots));
      setNewTimeSlot("");
      setShowAddTimeSlotDialog(false);
    }
  };

  const handleDeleteTimeSlot = (index) => {
    const timeSlotToDelete = timeSlots[index];
    // Remove entries for this time slot from gridData
    const newGridData = {};
    Object.keys(gridData).forEach(key => {
      if (!key.includes(timeSlotToDelete)) {
        newGridData[key] = gridData[key];
      }
    });
    setGridData(newGridData);
    // Remove the time slot
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  const handleEditTimeSlot = (index) => {
    setEditingTimeSlot({ index, value: timeSlots[index] });
    setEditTimeSlotDialog(true);
  };


  const handleSaveEditTimeSlot = () => {
    if (editingTimeSlot.value.trim()) {
      const formattedTimeSlot = formatTimeSlot(editingTimeSlot.value.trim());

      if (!formattedTimeSlot) {
        alert("Please enter a valid time slot format (e.g., 9:00-10:00 or 17:30-18:30)");
        return;
      }

      if (timeSlots.includes(formattedTimeSlot) && formattedTimeSlot !== timeSlots[editingTimeSlot.index]) {
        alert("This time slot already exists!");
        return;
      }

      // Check for overlaps (excluding the current slot being edited)
      const overlapCheck = checkTimeSlotOverlap(formattedTimeSlot, timeSlots, editingTimeSlot.index);
      if (overlapCheck.hasOverlap) {
        alert(overlapCheck.message);
        return;
      }

      const oldTimeSlot = timeSlots[editingTimeSlot.index];
      const newTimeSlots = [...timeSlots];
      newTimeSlots[editingTimeSlot.index] = formattedTimeSlot;

      // Update gridData keys
      const newGridData = {};
      Object.keys(gridData).forEach(key => {
        if (key.includes(oldTimeSlot)) {
          const newKey = key.replace(oldTimeSlot, formattedTimeSlot);
          newGridData[newKey] = gridData[key];
        } else {
          newGridData[key] = gridData[key];
        }
      });
      setGridData(newGridData);
      setTimeSlots(sortTimeSlots(newTimeSlots));
      setEditTimeSlotDialog(false);
      setEditingTimeSlot({ index: -1, value: "" });
    }
  };

  // Handle course selection change
  const handleCourseChange = (value) => {
    setBatchDetails({
      course: value,
      batch: "", // Reset batch when course changes
      semester: "" // Reset semester when course changes
    });
  };

  // Handle batch selection change
  const handleBatchChange = (value) => {
    console.log(value);
    const selectedBatch = batches.find(batch => batch.Year === value);
    console.log(selectedBatch);
    setBatchDetails({
      ...batchDetails,
      batch_id: selectedBatch.ID,
      batch: value,
      semester: "" // Reset semester when batch changes
    });
  };

  // Handle semester selection change
  const handleSemesterChange = (value) => {
    setBatchDetails({
      ...batchDetails,
      semester: value,
      semester_id: value  // Add this line if you need the ID separately
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-indigo-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-semibold">Timetable Management</h1>
        <div>
          <Button variant="outline" className="mr-4 bg-white text-indigo-600 hover:bg-indigo-100" onClick={() => window.history.back()}>
            Dashboard
          </Button>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
            Logout
          </Button>
        </div>
      </div>

      {/* Loading/Error States */}
      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading data...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-4">
          <p className="text-red-600">{error}</p>
          <Button
            onClick={fetchAllData}
            className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Retry
          </Button>
        </div>
      )}

      {/* Controls */}
      <div className="p-6 bg-white shadow-md rounded-md mx-auto w-11/12 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Course:</label>
            <Select
              disabled={isLocked || loading}
              value={batchDetails.course}
              onValueChange={handleCourseChange}
            >
              <SelectTrigger className="w-full border rounded-lg p-2">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.ID} value={course.Name}>
                    <div className="flex flex-col">
                      <span>{course.Name}</span>
                      {course.Code && (
                        <span className="text-xs text-gray-500">
                          {course.Code}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Batch:</label>
            <Select
              disabled={isLocked || loading || !batchDetails.course}
              value={batchDetails.batch}
              onValueChange={handleBatchChange}
            >
              <SelectTrigger className="w-full border rounded-lg p-2">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredBatches().map((batch) => (
                  <SelectItem key={batch.ID} value={batch.Year}>
                    <div className="flex flex-col">
                      <span>{batch.Year}</span>
                      {batch.Section && (
                        <span className="text-xs text-gray-500">
                          Section: {batch.Section}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Semester:</label>
            <Select
              disabled={isLocked || loading || !batchDetails.batch}
              value={batchDetails.semester}
              onValueChange={handleSemesterChange}
            >
              <SelectTrigger className="w-full border rounded-lg p-2">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredSemesters().map((semester) => (
                  <SelectItem key={semester.id} value={semester.id || semester.number?.toString()}>
                    <div className="flex flex-col">
                      <span>{semester.id || semester.number}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Button
            className={`w-full font-semibold py-2 rounded-md shadow-md ${allDetailsSelected() && !loading
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            onClick={handleGenerateTimetable}
            disabled={!allDetailsSelected() || loading}
          >
            Generate Timetable Grid
          </Button>
        </div>
      </div>

      {/* Timetable Grid */}
      {showTimetable && allDetailsSelected() && (
        <div className="flex justify-center items-center flex-grow mt-6">
          <div className="w-full max-w-6xl bg-white shadow-lg rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-700">Timetable Grid</h2>
              <Button
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                onClick={() => setShowAddTimeSlotDialog(true)}
              >
                <Plus size={16} />
                Add Time Slot
              </Button>

            </div>
            <div className="overflow-auto">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-300 bg-gray-100 px-4 py-2 text-left">
                      Day / Time
                    </th>
                    {timeSlots.map((slot, index) => (
                      <th
                        key={slot}
                        className="border border-gray-300 bg-gray-100 px-2 py-2 text-left relative min-w-[140px]"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{slot}</span>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 hover:bg-indigo-100"
                                onClick={() => handleEditTimeSlot(index)}
                                title="Edit time slot"
                              >
                                <Edit size={10} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-5 w-5 p-0 hover:bg-red-100 text-red-600"
                                onClick={() => {
                                  if (window.confirm(`Are you sure you want to delete the time slot "${slot}"? This will remove all entries for this time slot.`)) {
                                    handleDeleteTimeSlot(index);
                                  }
                                }}
                                title="Delete time slot"
                              >
                                <Trash2 size={10} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day}>
                      <td className="border border-gray-300 px-4 py-2 font-medium">{day}</td>
                      {timeSlots.map((time) => (
                        <td
                          key={`${day}-${time}`}
                          className="border border-gray-300 px-4 py-2 cursor-pointer text-center hover:bg-indigo-50"
                          onClick={() => handleCellClick(day, time)}
                        >
                          {gridData[`${day}-${time}`] ? (
                            <>
                              <div className="font-semibold">
                                {gridData[`${day}-${time}`]?.subject}
                              </div>
                              <div className="text-sm text-gray-500">
                                {gridData[`${day}-${time}`]?.code}
                              </div>
                              <div className="text-sm text-indigo-600">
                                {gridData[`${day}-${time}`]?.faculty}
                              </div>
                            </>
                          ) : (
                            ""
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Time Slot Dialog */}
      <Dialog open={showAddTimeSlotDialog} onOpenChange={setShowAddTimeSlotDialog}>
        <DialogContent className="rounded-md shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-indigo-600">Add New Time Slot</DialogTitle>
            <DialogClose onClick={() => setShowAddTimeSlotDialog(false)} />
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Time Slot (24-hour format):</label>
              <Input
                type="text"
                placeholder="e.g., 17:00-18:00 or 9:30-10:30"
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                className="w-full border rounded-lg p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: HH:MM-HH:MM (e.g., 09:00-10:00, 17:30-18:30)
                <br />
                <span className="text-orange-600 font-medium">Note: Time slots cannot overlap with existing ones</span>
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              onClick={handleAddTimeSlot}
            >
              Add Time Slot
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              onClick={() => setShowAddTimeSlotDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Time Slot Dialog */}
      <Dialog open={editTimeSlotDialog} onOpenChange={setEditTimeSlotDialog}>
        <DialogContent className="rounded-md shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-indigo-600">Edit Time Slot</DialogTitle>
            <DialogClose onClick={() => setEditTimeSlotDialog(false)} />
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Time Slot (24-hour format):</label>
              <Input
                type="text"
                placeholder="e.g., 17:00-18:00 or 9:30-10:30"
                value={editingTimeSlot.value}
                onChange={(e) => setEditingTimeSlot({ ...editingTimeSlot, value: e.target.value })}
                className="w-full border rounded-lg p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: HH:MM-HH:MM (e.g., 09:00-10:00, 17:30-18:30)
                <br />
                <span className="text-orange-600 font-medium">Note: Time slots cannot overlap with existing ones</span>
              </p>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              onClick={handleSaveEditTimeSlot}
            >
              Save Changes
            </Button>
            <Button
              variant="secondary"
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
              onClick={() => setEditTimeSlotDialog(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog for adding/editing timetable entries */}
      {selectedCell && (
        <Dialog open={!!selectedCell} onOpenChange={() => setSelectedCell(null)}>
          <DialogContent className="rounded-md shadow-lg">
            <DialogHeader>
              <DialogTitle className="text-indigo-600">
                Add/Edit Timetable Entry
              </DialogTitle>
              <DialogClose onClick={() => setSelectedCell(null)} />
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Subject:</label>
                <Select
                  value={dialogData.subject}
                  onValueChange={(value) => {
                    const selectedSubject = subjects.find(sub => sub.Name === value);
                    setDialogData({
                      subject: selectedSubject?.Name || "",
                      code: selectedSubject?.Code || "",
                      faculty: dialogData.faculty
                    });
                  }}
                >
                  <SelectTrigger className="w-full border rounded-lg p-2">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.ID} value={subject.Name}>
                        <div className="flex flex-col">
                          <span>{subject.Name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Faculty:</label>
                <Select
                  value={dialogData.faculty}
                  onValueChange={(value) => setDialogData({
                    ...dialogData,
                    faculty: value
                  })}
                >
                  <SelectTrigger className="w-full border rounded-lg p-2">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.ID} value={faculty.Name}>
                        <div className="flex flex-col">
                          <span>{faculty.Name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                variant="success"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                onClick={handleSaveEntry}
              >
                Save Entry
              </Button>
              <Button
                variant="secondary"
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
                onClick={() => setSelectedCell(null)}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}    
    </div>
  );
};

export default CreateTable;