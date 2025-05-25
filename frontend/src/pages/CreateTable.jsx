import React, { useState } from "react";
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
    batchYear: "",
    semester: "",
    course: "",
    room: "",
  });
  const [isLocked, setIsLocked] = useState(false);
  const [timeSlots, setTimeSlots] = useState([...academicData.timeSlots]);
  const [showAddTimeSlotDialog, setShowAddTimeSlotDialog] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [editTimeSlotDialog, setEditTimeSlotDialog] = useState(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState({ index: -1, value: "" });

  // Get filtered subjects based on selected semester
  const getFilteredSubjects = () => {
    if (!batchDetails.semester) return academicData.subjects;
    const semesterNumber = parseInt(batchDetails.semester);
    return academicData.subjects.filter(subject =>
      subject.semesters.includes(semesterNumber)
    );
  };

  // Add this function to filter courses based on selected batch
  const getFilteredCourses = () => {
    if (!batchDetails.batchYear) return academicData.courses;

    const selectedBatch = academicData.batches.find(b => b.name === batchDetails.batchYear);
    if (!selectedBatch) return academicData.courses;

    // If batch is IT-2K22, only show B.Tech IT courses
    if (selectedBatch.id === "it-2k22") {
      return academicData.courses.filter(course =>
        course.name.includes("B.Tech IT")
      );
    }

    // Default behavior - filter courses by department
    return academicData.courses.filter(course =>
      course.department === selectedBatch.department
    );
  };

  // Replace the getFilteredFaculties function with this simplified version
  const getFilteredFaculties = () => {
    return academicData.faculties; // Now returns all faculties regardless of subject
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
    return batchDetails.batchYear && batchDetails.semester && batchDetails.course && batchDetails.room;
  };

  const handleCellClick = (day, time) => {
    setSelectedCell({ day, time });
    setDialogData(gridData[`${day}-${time}`] || { subject: "", code: "", faculty: "" });
  };

  const handleSaveEntry = () => {
    if (selectedCell) {
      const key = `${selectedCell.day}-${selectedCell.time}`;
      setGridData({ ...gridData, [key]: dialogData });
      setSelectedCell(null);
    }
  };

  const handleDialogInputChange = (field, value) => {
    if (field === "subject") {
      const selectedSubject = academicData.subjects.find((sub) => sub.name === value);
      setDialogData({
        ...dialogData,
        subject: selectedSubject.name,
        code: selectedSubject.code,
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

      {/* Controls */}
      <div className="p-6 bg-white shadow-md rounded-md mx-auto w-11/12 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Batch Year:</label>
            <Select
              disabled={isLocked}
              value={batchDetails.batchYear}
              onValueChange={(value) =>
                setBatchDetails({ ...batchDetails, batchYear: value, course: "" })
              }
            >
              <SelectTrigger className="w-full border rounded-lg p-2">
                <SelectValue placeholder="Select batch" />
              </SelectTrigger>
              <SelectContent>
                {academicData.batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.name}>
                    {batch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Semester:</label>
            <Select
              disabled={isLocked}
              value={batchDetails.semester}
              onValueChange={(value) =>
                setBatchDetails({ ...batchDetails, semester: value })
              }
            >
              <SelectTrigger className="w-full border rounded-lg p-2">
                <SelectValue placeholder="Select semester" />
              </SelectTrigger>
              <SelectContent>
                {academicData.semesters.map((semester) => (
                  <SelectItem key={semester.id} value={semester.number.toString()}>
                    {semester.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Course:</label>
            <Select
              disabled={isLocked}
              value={batchDetails.course}
              onValueChange={(value) =>
                setBatchDetails({ ...batchDetails, course: value })
              }
            >
              <SelectTrigger className="w-full border rounded-lg p-2">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {getFilteredCourses().map((course) => (
                  <SelectItem key={course.id} value={course.name}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Room:</label>
            <Select
              disabled={isLocked}
              value={batchDetails.room}
              onValueChange={(value) =>
                setBatchDetails({ ...batchDetails, room: value })
              }
            >
              <SelectTrigger className="w-full border rounded-lg p-2">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {academicData.rooms.map((room) => (
                  <SelectItem key={room.id} value={room.name}>
                    <div className="flex flex-col">
                      <span>{room.name}</span>
                      <span className="text-xs text-gray-500">
                        {room.type} - Capacity: {room.capacity}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-4">
          <Button
            className={`w-full font-semibold py-2 rounded-md shadow-md ${allDetailsSelected()
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            onClick={handleGenerateTimetable}
            disabled={!allDetailsSelected()}
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
                  onValueChange={(value) => handleDialogInputChange("subject", value)}
                >
                  <SelectTrigger className="w-full border rounded-lg p-2">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredSubjects().map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        <div className="flex flex-col">
                          <span>{subject.name}</span>
                          <span className="text-xs text-gray-500">
                            {subject.code} - {subject.credits} Credits
                          </span>
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
                  onValueChange={(value) => handleDialogInputChange("faculty", value)}
                >
                  <SelectTrigger className="w-full border rounded-lg p-2">
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {getFilteredFaculties().map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.name}>
                        <div className="flex flex-col">
                          <span>{faculty.name}</span>
                          <span className="text-xs text-gray-500">
                            {faculty.designation} - {faculty.department}
                          </span>
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