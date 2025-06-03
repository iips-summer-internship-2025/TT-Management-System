import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Edit2, Trash2, Plus } from 'lucide-react';
import data from "../assets/academicData.json";

const initialBatchesData = data.batches;

function ManageBatches() {
  const [batches, setBatches] = useState(initialBatchesData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', department: '', year: '' });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const { name, department, year } = formData;
    const trimmedName = name.trim();
    const trimmedDept = department.trim();
    const yearInt = parseInt(year);
    const newErrors = {};

    if (!trimmedName) newErrors.name = 'Name is required';
    if (!trimmedDept) newErrors.department = 'Department is required';
    if (!year || isNaN(yearInt) || yearInt < 2000 || yearInt > 2100) {
      newErrors.year = 'Valid year (2000–2100) is required';
    }

    const isDuplicate = batches.some((b) =>
      b.name.toLowerCase() === trimmedName.toLowerCase() &&
      b.department.toLowerCase() === trimmedDept.toLowerCase() &&
      parseInt(b.year) === yearInt &&
      b.id !== editingId
    );

    if (isDuplicate) newErrors.name = 'Batch with same name, department, and year already exists';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const trimmedData = {
      name: formData.name.trim(),
      department: formData.department.trim(),
      year: parseInt(formData.year)
    };

    if (editMode) {
      const updatedBatches = batches.map((batch) =>
        batch.id === editingId ? { ...batch, ...trimmedData } : batch
      );
      setBatches(updatedBatches);
    } else {
      const newBatch = {
        id: Math.max(...batches.map((b) => b.id), 0) + 1,
        ...trimmedData
      };
      setBatches([...batches, newBatch]);
    }

    setFormData({ name: '', department: '', year: '' });
    setErrors({});
    setEditMode(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (batch) => {
    setFormData({
      name: batch.name,
      department: batch.department,
      year: batch.year.toString()
    });
    setEditingId(batch.id);
    setEditMode(true);
    setIsDialogOpen(true);
  };

  const handleDelete = (id) => {
    setBatches(batches.filter((batch) => batch.id !== id));
  };

  const handleCancel = () => {
    setFormData({ name: '', department: '', year: '' });
    setErrors({});
    setEditMode(false);
    setEditingId(null);
    setIsDialogOpen(false);
  };

  return (
    <>
      <div className="bg-slate-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-16 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-semibold leading-tight">
            IIPS Timetable Management <br /> System
          </h1>
          <button
            className="border border-white text-white px-5 py-2 rounded hover:bg-white hover:text-[#2c3e50]"
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
            <h2 className="text-lg font-semibold">Manage Batches</h2>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => {
                    setFormData({ name: '', department: '', year: '' });
                    setEditMode(false);
                    setErrors({});
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Batch
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>{editMode ? 'Edit Batch' : 'Add New Batch'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Batch Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input
                      id="department"
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className={errors.department ? 'border-red-500' : ''}
                    />
                    {errors.department && (
                      <p className="text-red-500 text-sm">{errors.department}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      type="number"
                      min="2000"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', e.target.value)}
                      className={errors.year ? 'border-red-500' : ''}
                    />
                    {errors.year && <p className="text-red-500 text-sm">{errors.year}</p>}
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button type="button" variant="outline" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
                      {editMode ? 'Update Batch' : 'Add Batch'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <table className="w-full table-auto">
            <thead>
              <tr className="bg-slate-800 text-white text-left">
                <th className="px-6 py-2 font-medium">Name</th>
                <th className="px-6 py-2 font-medium">Department</th>
                <th className="px-6 py-2 font-medium">Year</th>
                <th className="px-6 py-2 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {batches.map((batch, index) => (
                <tr key={batch.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                  <td className="px-6 py-2">{batch.name}</td>
                  <td className="px-6 py-2">{batch.department}</td>
                  <td className="px-6 py-2">{batch.year}</td>
                  <td className="px-6 py-2">
                    <button
                      className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-1 rounded text-sm mr-2 inline-flex items-center"
                      onClick={() => handleEdit(batch)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" />
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm inline-flex items-center"
                      onClick={() => handleDelete(batch.id)}
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

export default ManageBatches;
