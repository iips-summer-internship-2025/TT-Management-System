import './App.css'
import LoginPage from './pages/LoginPage'
import CreateTable from './pages/CreateTable'
import ViewTable from './pages/ViewTimeTable'
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard'
import UpdateTimeTable from './pages/UpdateTimeTable'
import Subjects from './pages/ManageSubjects'
import Rooms from './pages/ManageRooms'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-timetable" element={<CreateTable />} />
        <Route path="/update-timetable" element={<UpdateTimeTable />} />
        <Route path="/view-timetable" element={<ViewTable />} />
        <Route path="/manage-subjects" element={<Subjects />} />
        <Route path="/manage-rooms" element={<Rooms />} />
      </Routes>
    </>
  )
}

export default App
