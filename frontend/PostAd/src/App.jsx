import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostAdPage from './pages/PostAdPage';
import AdDetails from './pages/AdDetails';
import Navbar from './components/Navbar'
import RegisterModal from './components/RegisterModal';
import LoginModal from './pages/LoginPage';
import './App.css';

function App() {
 const [showModal, setShowModal] = useState(false);
const [modalMode, setModalMode] = useState("login"); 

const openLogin = () => {
  setModalMode("login");
  setShowModal(true);
};

const openRegister = () => {
  setModalMode("register");
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
};

 const user = JSON.parse(localStorage.getItem('user'));

  const onPostAdClick = () => {
    if (!user) return openLogin();
    window.location.href = "/post-ad"; 
  };
  return (
    <Router>
       <Navbar onPostAdClick={onPostAdClick} openLogin={openLogin} />
    
    {showModal && (
  modalMode === "login"
    ? <LoginModal close={closeModal} switchToRegister={openRegister} />
    : <RegisterModal close={closeModal} switchToLogin={openLogin} />
)}


      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post-ad" element={<PostAdPage />} />
        <Route path="/ads/:id" element={<AdDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
