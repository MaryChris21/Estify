import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './Components/Home.jsx'
import AdminDashboard from './Components/AdminDashboard.jsx'
import AllProperties from './Components/AllProperties.jsx'
import UserProperties from './Components/UserProperties.jsx'

createRoot(document.getElementById('root')).render(
  <Router>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/admin' element={<AdminDashboard/>}></Route>
      <Route path='/allProperties' element={<AllProperties/>}></Route>
      <Route path='/properties' element={<UserProperties/>}></Route>
    </Routes>
  </Router>
)
 