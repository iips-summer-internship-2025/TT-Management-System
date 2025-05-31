import './App.css'
import LoginPage from './pages/LoginPage'
import CreateTable from './pages/CreateTable'
import ViewTable from './pages/ViewTimeTable'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import Courses from './pages/ManageCourses'
import Subjects from './pages/ManageSubjects'
import Rooms from './pages/ManageRooms'
import Faculty from './pages/ManageFaculty';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-timetable" element={<CreateTable />} />
        <Route path="/manage-courses" element={<Courses />} />
        <Route path="/view-timetable" element={<ViewTable />} />
        <Route path="/manage-subjects" element={<Subjects />} />
        <Route path="/manage-rooms" element={<Rooms />} />
        <Route path="/manage-faculty" element={<Faculty />} />
      </Routes>
    </>
  )
}

export default App
