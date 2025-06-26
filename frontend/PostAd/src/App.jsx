import { useState } from 'react'
import HomePage from './pages/HomePage';
import PostAdPage from './pages/PostAdPage';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css'

function App() {
  const user=JSON.parse(localStorage.getItem("user"));

  return (
    
      <Router>
        <Routes>
          <Route path="/" element={ <HomePage/>} />
          <Route path="/post-ad" element={user?<PostAdPage/>:<HomePage forceLogin={true}/>}/>
          </Routes>
      </Router>
       
      
  )
}

export default App
