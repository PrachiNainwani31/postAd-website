import React, { useState, useEffect } from 'react';
import '../styles/Navbar.css';
import logo from '../assets/logo.jpg';

const Navbar = ({ onPostAdClick, user, setUser, openLogin }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetch("http://localhost:5000/api/auth/validate", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
          } else {
            handleLogout();
          }
        })
        .catch(() => handleLogout());
    }
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setSidebarOpen(!sidebarOpen);
    else setShowDropdown(!showDropdown);
  };

  const closeSidebar = () => setSidebarOpen(false);
  const closeDropdown = () => setShowDropdown(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    closeSidebar();
    closeDropdown();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="logo-img" />
          <span className="site-name">PostAd</span>
        </div>

        <div className="navbar-right">
          <input type="text" className="search-input" placeholder="Search..." />
          {!isMobile && (
            <div className="nav-buttons">
              <button className="btn post-btn" onClick={onPostAdClick}>Post Ad</button>
              {user ? (
                <div className="user-avatar" onClick={toggleSidebar}>
                  {user.name?.charAt(0)}
                </div>
              ) : (
                <button className="btn" onClick={openLogin}>Login/Register</button>
              )}
              <div className="hamburger" onClick={toggleSidebar}>☰</div>
            </div>
          )}
          {isMobile && (
            <div className="hamburger" onClick={toggleSidebar}>☰</div>
          )}
        </div>
      </nav>

      {!isMobile && showDropdown && user && (
        <div className="dropdown-menu">
          <button className="btn">My Ads</button>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {isMobile && sidebarOpen && (
        <>
          <div className="overlay" onClick={closeSidebar}></div>
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            {user && <div className="user-avatar sidebar-avatar">{user.name?.charAt(0)}</div>}
            {user ? (
              <>
                <button className="btn">My Ads</button>
              </>
            ) : (
              <button className="btn" onClick={openLogin}>Login/Register</button>
            )}
            <button className="btn post-btn" onClick={onPostAdClick}>Post Ad</button>
            <div className="spacer" style={{ flexGrow: 1 }}></div>
            {user && <button className="btn logout-btn" onClick={handleLogout}>Logout</button>}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
