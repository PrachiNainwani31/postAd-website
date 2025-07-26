import { useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PostAdPage from './pages/PostAdPage';
import AdDetails from './pages/AdDetails';
import Navbar from './components/Navbar';
import RegisterModal from './components/RegisterModal';
import LoginModal from './pages/LoginPage';
import MyAds from './pages/MyAds';
import AdminUsers from './pages/AdminUsers';
import AdminUserAds from './pages/AdminUserAds';
import AdminAllAds from './pages/AdminAllAds';
import { AuthContext } from './context/AuthContext';
import { useAuth } from './hooks/useAuth'; //  Custom hook for admin check
import './App.css';

function App() {
  const { user } = useContext(AuthContext);
  const { isAdmin } = useAuth(); //  use role-based logic
  const [searchQuery, setSearchQuery] = useState("");
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

  const onPostAdClick = () => {
    if (!user) {
      openLogin();
    } else {
      window.location.href = "/post-ad";
    }
  };

  return (
    <Router>
      <Navbar onPostAdClick={onPostAdClick} openLogin={openLogin} onSearch={setSearchQuery} />

      {showModal && (
        modalMode === "login" ? (
          <LoginModal close={closeModal} switchToRegister={openRegister} />
        ) : (
          <RegisterModal close={closeModal} switchToLogin={openLogin} />
        )
      )}

      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/post-ad" element={<PostAdPage />} />
        <Route path="/ads/:id" element={<AdDetails />} />
        <Route path="/myads" element={<MyAds />} />

        {/* Admin-only routes */}
        {isAdmin && (
          <>
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/users/:id/ads" element={<AdminUserAds />} />
            <Route path="/admin/ads" element={<AdminAllAds />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
