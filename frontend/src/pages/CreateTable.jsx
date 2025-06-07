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
import { Plus, Edit, Trash2, Save, RefreshCw, Trash } from "lucide-react";
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

  // New state variables for timetable management
  const [timetableState, setTimetableState] = useState({
    id: null,
    gridData: {},
    timeSlots: [...academicData.timeSlots],
    lastSaved: null,
    isExisting: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // API Data States
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [rooms, setRooms] = useState([]);

  const API_BASE_URL = "http://localhost:8080/api/v1";
  const API_ENDPOINTS = {
    GET_COURSE: `${API_BASE_URL}/course`,
    GET_BATCH: `${API_BASE_URL}/batch`,
    GET_SEMESTER: `${API_BASE_URL}/semester`,
    GET_SUBJECT: `${API_BASE_URL}/subject`,
    GET_FACULTY: `${API_BASE_URL}/faculty`,
    GET_ROOM: `${API_BASE_URL}/room`,
    LECTURE: `${API_BASE_URL}/lecture`,
  };

  // Fetch data from APIs
  useEffect(() => {
    fetchAllData();
  }, []);

  // Adding a function to debug the current state
  const debugCurrentState = () => {
    console.log('Current State Debug:', {
      batchDetails,
      selectedBatch: batches.find(batch => batch.Year === batchDetails.batch),
      selectedCourse: courses.find(course => course.Name === batchDetails.course),
      semesterNumber: romanToInteger(batchDetails.semester),
      gridDataKeys: Object.keys(gridData),
      timetableState
    });
  };


  // Adding debugging to the useEffect to track when it's triggered
  useEffect(() => {
    console.log('useEffect triggered with:', {
      course: batchDetails.course,
      batch: batchDetails.batch,
      semester: batchDetails.semester,
      batchesLength: batches.length,
      coursesLength: courses.length,
      subjectsLength: subjects.length,
      facultiesLength: faculties.length
    });

    // Only load existing lectures if we have all the necessary data
    if (allDetailsSelected() &&
      batches.length > 0 &&
      courses.length > 0 &&
      subjects.length > 0 &&
      faculties.length > 0) {
      console.log('Loading existing lectures...');
      loadExistingLectures();
    }
  }, [batchDetails.course, batchDetails.batch, batchDetails.semester, batches, courses, subjects, faculties]);

  // Sync timetableState with gridData and timeSlots
  useEffect(() => {
    setTimetableState(prev => ({
      ...prev,
      gridData: gridData,
      timeSlots: timeSlots
    }));
  }, [gridData, timeSlots]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchCourses(),
        fetchBatches(),
        fetchSubjects(),
        fetchFaculties(),
        fetchRooms()
      ]);
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

  const fetchRooms = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_ROOM, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.GET_BATCH, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

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

  const loadExistingLectures = async () => {
    if (!allDetailsSelected()) return;

    setIsLoading(true);
    try {
      const selectedBatch = batches.find(batch => batch.Year === batchDetails.batch);
      const selectedCourse = courses.find(course => course.Name === batchDetails.course);

      if (!selectedBatch || !selectedCourse) {
        console.log('Batch or course not found');
        return;
      }

      const semesterNumber = romanToInteger(batchDetails.semester);

      const response = await fetch(API_ENDPOINTS.LECTURE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        const allLectures = await response.json();
        console.log('All lectures from API:', allLectures);

        const filteredLectures = allLectures.filter(lecture =>
          lecture.BatchID === selectedBatch.ID &&
          lecture.SemesterID === semesterNumber
        );

        console.log('Filtered lectures for batch:', selectedBatch.ID, 'semester:', semesterNumber, filteredLectures);

        if (filteredLectures && filteredLectures.length > 0) {
          const reconstructedGridData = {};
          const reconstructedTimeSlots = new Set([...academicData.timeSlots]);

          filteredLectures.forEach(lecture => {
            const timeSlot = `${lecture.StartTime}-${lecture.EndTime}`;
            const key = `${lecture.DayOfWeek}-${timeSlot}`;

            const subject = subjects.find(sub => sub.ID === lecture.SubjectID);
            const faculty = faculties.find(fac => fac.ID === lecture.FacultyID);
            const room = rooms.find(r => r.ID === lecture.RoomID);

            reconstructedGridData[key] = {
              subject: subject?.Name || '',
              code: subject?.Code || '',
              faculty: faculty?.Name || '',
              room: room?.Name || ''
            };

            reconstructedTimeSlots.add(timeSlot);
          });

          const sortedTimeSlots = sortTimeSlots([...reconstructedTimeSlots]);

          setGridData(reconstructedGridData);
          setTimeSlots(sortedTimeSlots);
          setTimetableState({
            id: null,
            gridData: reconstructedGridData,
            timeSlots: sortedTimeSlots,
            lastSaved: new Date().toISOString(),
            isExisting: true
          });

          console.log('Filtered lectures loaded successfully:', Object.keys(reconstructedGridData).length, 'entries');
        } else {
          console.log('No existing lectures found for this batch/semester');
          resetTimetableState();
        }
      } else if (response.status === 404) {
        console.log('No lectures found in database');
        resetTimetableState();
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error loading lectures:', error);
      resetTimetableState();
    } finally {
      setIsLoading(false);
    }
  };

  const resetTimetableState = () => {
    const defaultGridData = {};
    const defaultTimeSlots = [...academicData.timeSlots];

    setGridData(defaultGridData);
    setTimeSlots(defaultTimeSlots);
    setTimetableState({
      id: null,
      gridData: defaultGridData,
      timeSlots: defaultTimeSlots,
      lastSaved: null,
      isExisting: false
    });
  };

  const saveLectures = async () => {
    if (!allDetailsSelected()) {
      alert('Please select course, batch, and semester');
      return;
    }

    setIsSaving(true);
    try {
      const selectedBatch = batches.find(batch => batch.Year === batchDetails.batch);
      const selectedCourse = courses.find(course => course.Name === batchDetails.course);

      if (!selectedBatch || !selectedCourse) {
        throw new Error('Selected batch or course not found');
      }

      const semesterNumber = romanToInteger(batchDetails.semester);

      const getAllResponse = await fetch(API_ENDPOINTS.LECTURE, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (getAllResponse.ok) {
        const allLectures = await getAllResponse.json();

        const lecturesToDelete = allLectures.filter(lecture =>
          lecture.BatchID === selectedBatch.ID &&
          lecture.SemesterID === semesterNumber
        );

        if (lecturesToDelete.length > 0) {
          console.log('Deleting existing lectures:', lecturesToDelete.length);
          const deletePromises = lecturesToDelete.map(lecture =>
            fetch(`${API_ENDPOINTS.LECTURE}/${lecture.ID}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              }
            })
          );

          const deleteResponses = await Promise.all(deletePromises);
          const deleteFailed = deleteResponses.some(res => !res.ok);

          if (deleteFailed) {
            console.warn('Some lectures failed to delete, but continuing with save...');
          }
        }
      }

      const lectures = Object.keys(timetableState.gridData)
        .map(key => {
          const [day, startTime, endTime] = key.split('-');
          const entry = timetableState.gridData[key];

          console.log('start entry:', startTime);
          console.log('end entry:', endTime);

          const subject = subjects.find(sub => sub.Name === entry.subject);
          const faculty = faculties.find(fac => fac.Name === entry.faculty);
          const room = rooms.find(r => r.Name === entry.room);

          if (subject && faculty) {
            return {
              DayOfWeek: day,
              StartTime: startTime,
              EndTime: endTime,
              SubjectID: subject.ID,
              FacultyID: faculty.ID,
              BatchID: selectedBatch.ID,
              SemesterID: semesterNumber,
              RoomID: room?.ID || 1
            };
          }
          return null;
        })
        .filter(lecture => lecture !== null);

      if (lectures.length > 0) {
        console.log('Creating new lectures:', lectures.length);
        const createResponses = await Promise.all(
          lectures.map(lecture =>
            fetch(API_ENDPOINTS.LECTURE, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(lecture)
            })
          )
        );

        const allSuccessful = createResponses.every(res => res.ok);
        if (!allSuccessful) {
          const errors = await Promise.all(
            createResponses.map(async (res, index) => {
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                return `Lecture ${index + 1}: ${errorData.message || res.statusText || 'Unknown error'}`;
              }
              return null;
            })
          );
          throw new Error(`Some lectures failed to save:\n${errors.filter(e => e).join('\n')}`);
        }
      }

      console.log('All lectures saved successfully');

      setTimetableState(prev => ({
        ...prev,
        lastSaved: new Date().toISOString(),
        isExisting: true
      }));

      alert('Timetable saved successfully!');
    } catch (error) {
      console.error('Error saving lectures:', error);
      alert(`Failed to save timetable: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };


  const getFilteredSubjects = () => {
    if (!batchDetails.semester) return subjects;
    const semesterNumber = romanToInteger(batchDetails.semester);
    return subjects.filter(subject =>
      subject.Semester === semesterNumber ||
      (subject.semesters && subject.semesters.includes(semesterNumber))
    );
  };

  const getFilteredBatches = () => {
    if (!batchDetails.course) return batches;
    const selectedCourse = courses.find(course => course.Name === batchDetails.course);
    if (!selectedCourse) return [];
    return batches.filter(batch => batch.CourseID === selectedCourse.ID);
  };

  const getFilteredSemesters = () => {
    if (!batchDetails.course && !batchDetails.batch) return semesters;
    return semesters.filter(semester => true);
  };

  const parseTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const sortTimeSlots = (slots) => {
    return slots.sort((a, b) => {
      const [startA] = a.split('-');
      const [startB] = b.split('-');
      return parseTimeToMinutes(startA) - parseTimeToMinutes(startB);
    });
  };

  const validateTimeSlot = (timeSlot) => {
    const timeSlotRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])-([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    return timeSlotRegex.test(timeSlot);
  };

  const formatTimeSlot = (timeSlot) => {
    if (!validateTimeSlot(timeSlot)) return null;
    const [startTime, endTime] = timeSlot.split('-');
    const formatTime = (time) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };
    return `${formatTime(startTime)}-${formatTime(endTime)}`;
  };

  const checkTimeSlotOverlap = (newTimeSlot, existingSlots, excludeIndex = -1) => {
    const [newStart, newEnd] = newTimeSlot.split('-');
    const newStartMinutes = parseTimeToMinutes(newStart);
    const newEndMinutes = parseTimeToMinutes(newEnd);

    if (newEndMinutes <= newStartMinutes) {
      return { hasOverlap: true, message: "End time must be after start time!" };
    }

    for (let i = 0; i < existingSlots.length; i++) {
      if (i === excludeIndex) continue;

      const [existingStart, existingEnd] = existingSlots[i].split('-');
      const existingStartMinutes = parseTimeToMinutes(existingStart);
      const existingEndMinutes = parseTimeToMinutes(existingEnd);

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


  const handleClearCell = (day, time) => {
    const key = `${day}-${time}`;
    const newGridData = { ...gridData };
    delete newGridData[key];
    setGridData(newGridData);

    setTimetableState(prev => ({
      ...prev,
      gridData: newGridData
    }));
  };

  const handleSaveEntry = () => {
    if (!selectedCell) return;

    const key = `${selectedCell.day}-${selectedCell.time}`;
    const newGridData = { ...gridData, [key]: dialogData };
    setGridData(newGridData);

    setTimetableState(prev => ({
      ...prev,
      gridData: newGridData
    }));

    setSelectedCell(null);
  };

  const handleDialogInputChange = (field, value) => {
    if (field === "subject") {
      const selectedSubject = subjects.find((sub) => sub.Name === value);
      setDialogData({
        subject: selectedSubject?.Name || "",
        code: selectedSubject?.Code || "",
        faculty: ""
      });
    } else {
      setDialogData({ ...dialogData, [field]: value });
    }
  };

  const clearTimetable = () => {
    if (window.confirm('Are you sure you want to clear the entire timetable? This action cannot be undone.')) {
      const defaultGridData = {};
      const defaultTimeSlots = [...academicData.timeSlots];

      setGridData(defaultGridData);
      setTimeSlots(defaultTimeSlots);
      setTimetableState({
        id: null,
        gridData: defaultGridData,
        timeSlots: defaultTimeSlots,
        lastSaved: null,
        isExisting: false
      });
    }
  };




  const handleGenerateTimetable = () => {
    if (allDetailsSelected()) {
      console.log('Generating timetable with:', batchDetails);
      debugCurrentState();
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
    const newGridData = {};
    Object.keys(gridData).forEach(key => {
      if (!key.includes(timeSlotToDelete)) {
        newGridData[key] = gridData[key];
      }
    });
    setGridData(newGridData);
    const newTimeSlots = timeSlots.filter((_, i) => i !== index);
    setTimeSlots(newTimeSlots);
  };

  const handleEditTimeSlot = (index) => {
    console.log("Editing time slot at index:", index);
    setEditTimeSlotDialog(true);
    console.log("Editing time slot at index:", index);
    setEditingTimeSlot({ index, value: timeSlots[index] });
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

      const overlapCheck = checkTimeSlotOverlap(formattedTimeSlot, timeSlots, editingTimeSlot.index);
      if (overlapCheck.hasOverlap) {
        alert(overlapCheck.message);
        return;
      }

      const oldTimeSlot = timeSlots[editingTimeSlot.index];
      const newTimeSlots = [...timeSlots];
      newTimeSlots[editingTimeSlot.index] = formattedTimeSlot;

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
      batch: "",
      semester: ""
    });
    setShowTimetable(false);
    setIsLocked(false);
  };

  // Handle batch selection change
  const handleBatchChange = (value) => {
    const selectedBatch = batches.find(batch => batch.Year === value);
    setBatchDetails({
      ...batchDetails,
      batch_id: selectedBatch?.ID,
      batch: value,
      semester: ""
    });
    setShowTimetable(false);
    setIsLocked(false);
  };

  // Handle semester selection change
  const handleSemesterChange = (value) => {
    setBatchDetails({
      ...batchDetails,
      semester: value,
      semester_id: value
    });
    setShowTimetable(false);
    setIsLocked(false);
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
      {(loading || isLoading) && (
        <div className="text-center py-4">
          <p className="text-gray-600">
            {loading ? 'Loading data...' : 'Loading timetable...'}
          </p>
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

        <div className="mt-4 flex gap-4">
          <Button
            className={`flex-1 font-semibold py-2 rounded-md shadow-md ${allDetailsSelected() && !loading
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            onClick={handleGenerateTimetable}
            disabled={!allDetailsSelected() || loading}
          >
            Generate Timetable Grid
          </Button>
        </div>

        {/* Timetable State Info */}
        {showTimetable && timetableState.lastSaved && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Status:</strong> {timetableState.isExisting ? 'Existing timetable loaded' : 'New timetable'} |
              <strong> Last saved:</strong> {new Date(timetableState.lastSaved).toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Timetable Grid */}
      {showTimetable && allDetailsSelected() && (
        <div className="flex justify-center items-center flex-grow mt-6">
          <div className="w-full max-w-6xl bg-white shadow-lg rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-indigo-700">Timetable Grid</h2>
              <div className="flex gap-2">
                <Button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2"
                  onClick={() => setShowAddTimeSlotDialog(true)}
                >
                  <Plus size={16} />
                  Add Time Slot
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                  onClick={saveLectures}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {timetableState.isExisting ? 'Update Timetable' : 'Save Timetable'}
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                  onClick={clearTimetable}
                >
                  <Trash size={16} />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Timetable Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-indigo-100">
                    <th className="border border-gray-300 p-2 text-center font-semibold text-indigo-700">
                      Day / Time
                    </th>
                    {timeSlots.map((time, index) => (
                      <th
                        key={index}
                        className="border border-gray-300 p-2 text-center font-semibold text-indigo-700 relative"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-xs">{time}</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => handleEditTimeSlot(index)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                              title="Edit time slot"
                            >
                              <Edit size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteTimeSlot(index)}
                              className="text-red-600 hover:text-red-800 p-1"
                              title="Delete time slot"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map((day) => (
                    <tr key={day}>
                      <td className="border border-gray-300 p-2 font-semibold text-indigo-700 bg-indigo-50 text-center">
                        {day}
                      </td>
                      {timeSlots.map((time) => {
                        const cellData = gridData[`${day}-${time}`];
                        return (
                          <td
                            key={`${day}-${time}`}
                            className="border border-gray-300 p-2 text-center cursor-pointer hover:bg-gray-100 h-20"
                            onClick={() => handleCellClick(day, time)}
                          >
                            {cellData ? (
                              <div className="text-xs">
                                <div className="font-semibold text-indigo-700">
                                  {cellData.subject}
                                </div>
                                <div className="text-gray-600">
                                  {cellData.code}
                                </div>
                                <div className="text-gray-500">
                                  {cellData.faculty}
                                </div>
                              </div>
                            ) : (
                              <div className="text-gray-400 text-xs">Click to add</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Dialog for adding/editing entries */}
      <Dialog open={selectedCell !== null} onOpenChange={() => setSelectedCell(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedCell && gridData[`${selectedCell.day}-${selectedCell.time}`]
                ? "Edit Entry"
                : "Add Entry"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject:</label>
              <Select
                value={dialogData.subject}
                onValueChange={(value) => handleDialogInputChange("subject", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.ID} value={subject.Name}>
                      <div className="flex flex-col">
                        <span>{subject.Name}</span>
                        <span className="text-xs text-gray-500">
                          {subject.Code}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subject Code:</label>
              <Input
                value={dialogData.code}
                onChange={(e) => handleDialogInputChange("code", e.target.value)}
                placeholder="Subject code"
                readOnly
                className="bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Faculty:</label>
              <Select
                value={dialogData.faculty}
                onValueChange={(value) => handleDialogInputChange("faculty", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {faculties.map((faculty) => (
                    <SelectItem key={faculty.ID} value={faculty.Name}>
                      <div className="flex flex-col">
                        <span>{faculty.Name}</span>
                        {faculty.Email && (
                          <span className="text-xs text-gray-500">
                            {faculty.Email}
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            {/* Add this button if editing an existing entry */}
            {selectedCell && gridData[`${selectedCell.day}-${selectedCell.time}`] && (
              <Button
                variant="destructive"
                onClick={() => {
                  handleClearCell(selectedCell.day, selectedCell.time);
                  setSelectedCell(null);
                }}
                className="mr-auto"
              >
                Clear Entry
              </Button>
            )}
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSaveEntry}
              disabled={!dialogData.subject || !dialogData.faculty}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Time Slot Dialog - ADD THIS AFTER YOUR EXISTING DIALOGS */}
      <Dialog open={editTimeSlotDialog} onOpenChange={setEditTimeSlotDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Time Slot (e.g., 9:00-10:00):
              </label>
              <Input
                value={editingTimeSlot.value}
                onChange={(e) => setEditingTimeSlot(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g., 9:00-10:00 or 17:30-18:30"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: HH:MM-HH:MM (24-hour format)
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setEditTimeSlotDialog(false);
                  setEditingTimeSlot({ index: -1, value: "" });
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleSaveEditTimeSlot}
              disabled={!editingTimeSlot.value.trim()}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Time Slot Dialog */}
      <Dialog open={showAddTimeSlotDialog} onOpenChange={setShowAddTimeSlotDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Time Slot</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Time Slot (e.g., 9:00-10:00):
              </label>
              <Input
                value={newTimeSlot}
                onChange={(e) => setNewTimeSlot(e.target.value)}
                placeholder="e.g., 9:00-10:00 or 17:30-18:30"
              />
              <p className="text-xs text-gray-500 mt-1">
                Format: HH:MM-HH:MM (24-hour format)
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={handleAddTimeSlot}
              disabled={!newTimeSlot}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateTable