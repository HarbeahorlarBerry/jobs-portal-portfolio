import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import ApplyJob from './pages/ApplyJob'
import Home from './pages/Home'
import Applications from './pages/Applications'
import Dashboard from './pages/Dashboard'
import AddJobs from './pages/AddJobs'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import RecruiterLogin from './components/RecruiterLogin'
import { AppContext } from './context/AppContext'
import "quill/dist/quill.snow.css"
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";


const App = () => {

  const { showRecruiterLogin, companyToken} = useContext(AppContext)
  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/apply-job/:id" element={<ApplyJob />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/dashboard" element={<Dashboard />}>
        {companyToken ? <>
          <Route path="add-jobs" element={<AddJobs />} />
          <Route path="manage-jobs" element={<ManageJobs />} />
          <Route path="view-applications" element={<ViewApplications />} />
        </> : null
        }
        </Route>

      </Routes>
    </div>
  )
}

export default App
