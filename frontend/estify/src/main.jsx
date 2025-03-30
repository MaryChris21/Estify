import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Onboarding from './pages/Onboarding.jsx'
import Homepage from './pages/Homepage.jsx'
import Home from './Components/Home.jsx'
import PropertyForm from './Components/PropertyForm.jsx'
import AdminDashboard from './Components/AdminDashboard.jsx'
import AllProperties from './Components/AllProperties.jsx'
import UserProperties from './Components/UserProperties.jsx'
import AgentSignup from './Components/AgentSignup.jsx'
import AgentLogin from './Components/AgentLogin.jsx'
import AgentDashboard from './Components/AgentDashboard.jsx'

import DynamicReport from './Components/DynamicReport.jsx'

import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


createRoot(document.getElementById('root')).render(

  <StrictMode>
  <Router>
    <Routes>
      <Route path='/' element={<Onboarding/>}></Route>
      <Route path='/homepage' element={<Homepage/>}></Route>
      <Route path='/postad' element={<Home/>}></Route>
      <Route path='/admin' element={<AdminDashboard/>}></Route>
      <Route path='/allProperties' element={<AllProperties/>}></Route>
      <Route path='/properties' element={<UserProperties/>}></Route>
      <Route path='/agent-signup' element={<AgentSignup/>}></Route>
      <Route path='/agent-login' element={<AgentLogin/>}></Route>
      <Route path='/agent-dashboard' element={<AgentDashboard/>}></Route>


      <Route path="/agent/postad" element={<PropertyForm/>} />
      <Route path='/report' element={<DynamicReport/>}></Route>

    </Routes>
  </Router>
  
  <ToastContainer position="top-right" autoClose={3000} theme="colored" />
  </StrictMode>
)
 