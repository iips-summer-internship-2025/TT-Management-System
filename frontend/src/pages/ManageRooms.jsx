import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import data from "../assets/academicData.json";

// Sample initial data - replace with your actual data import
const initialRoomsData = data.rooms;

function ManageRooms() {
  const [rooms, setRooms] = useState(initialRoomsData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    floor: '',
    capacity: '',
    type: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleEdit = (id) => {
    console.log("Edit Room", id);
  };

  const handleDelete = (id) => {
    console.log("Delete Room", id);
    // Remove room from state
    setRooms(rooms.filter(room => room.id !== id));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Room name is required';
    }
    
    if (!formData.floor.trim()) {
      newErrors.floor = 'Floor is required';
    }
    
    if (!formData.capacity || formData.capacity <= 0) {
      newErrors.capacity = 'Valid capacity is required';
    }
    
    if (!formData.type) {
      newErrors.type = 'Room type is required';
    }
    
    // Check if room name already exists
    if (formData.name.trim() && rooms.some(room => 
      room.name.toLowerCase() === formData.name.trim().toLowerCase()
    )) {
      newErrors.name = 'Room name already exists';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Create new room object
      const newRoom = {
        id: Math.max(...rooms.map(r => r.id)) + 1, // Simple ID generation
        name: formData.name.trim(),
        floor: formData.floor.trim(),
        capacity: parseInt(formData.capacity),
        type: formData.type
      };

      // Here you would typically make an API call to save to database
      // const response = await fetch('/api/rooms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newRoom)
      // });
      
      // For now, we'll just add to local state
      setRooms(prev => [...prev, newRoom]);
      
      // Reset form and close dialog
      setFormData({ name: '', floor: '', capacity: '', type: '' });
      setErrors({});
      setIsDialogOpen(false);
      
      console.log("New room added:", newRoom);
      
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  const handleCancel = () => {
    setFormData({ name: '', floor: '', capacity: '', type: '' });
    setErrors({});
    setIsDialogOpen(false);
  };

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

          <button 
            className="border border-white text-white px-5 py-2 rounded hover:bg-white hover:text-[#2c3e50] transition" 
            onClick={() => navigate("/dashboard")}
          >
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
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Room
                </Button>
              </DialogTrigger>
              
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Room</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="roomName">Room Name</Label>
                    <Input
                      id="roomName"
                      type="text"
                      placeholder="e.g., Room 101, Lab A"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="floor">Floor</Label>
                    <Input
                      id="floor"
                      type="text"
                      placeholder="e.g., 1st Floor, Ground Floor"
                      value={formData.floor}
                      onChange={(e) => handleInputChange('floor', e.target.value)}
                      className={errors.floor ? 'border-red-500' : ''}
                    />
                    {errors.floor && <p className="text-red-500 text-sm">{errors.floor}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      placeholder="e.g., 30"
                      min="1"
                      value={formData.capacity}
                      onChange={(e) => handleInputChange('capacity', e.target.value)}
                      className={errors.capacity ? 'border-red-500' : ''}
                    />
                    {errors.capacity && <p className="text-red-500 text-sm">{errors.capacity}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Room Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Classroom">Classroom</SelectItem>
                        <SelectItem value="Laboratory">Laboratory</SelectItem>
                        <SelectItem value="Auditorium">Auditorium</SelectItem>
                        <SelectItem value="Conference Room">Conference Room</SelectItem>
                        <SelectItem value="Tutorial Room">Tutorial Room</SelectItem>
                        <SelectItem value="Seminar Hall">Seminar Hall</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                      Add Room
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-800 text-white text-left">
                <th className="px-6 py-2 font-medium">Room Name</th>
                <th className="px-6 py-2 font-medium">Floor</th>
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
                    <button 
                      className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm mr-2 inline-flex items-center"
                      onClick={() => handleEdit(room.id)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <button 
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm inline-flex items-center"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
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
}

export default ManageRooms;