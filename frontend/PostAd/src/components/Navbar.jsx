import React, { useState, useEffect, useContext } from 'react';
import '../styles/Navbar.css';
import logo from '../assets/logo.jpg';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = ({ onPostAdClick, openLogin, onSearch }) => {
  const { user, login, logout, setUser } = useContext(AuthContext);
  const isAdmin = user?.role === 'admin';
  const avatarLabel = isAdmin ? 'admin' : user?.name?.charAt(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchInput = (e) => setSearchTerm(e.target.value);
  const handleSearchSubmit = () => onSearch(searchTerm);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && !user) {
      fetch("http://localhost:5001/api/auth/validate", {
        headers: { Authorization: `Bearer ${storedToken}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data.valid) setUser(data.user);
          else logout();
        })
        .catch(() => logout());
    }
  }, []);

  const toggleSidebar = () => {
    if (isMobile) setSidebarOpen(!sidebarOpen);
    else setShowDropdown(!showDropdown);
  };

  const closeSidebar = () => setSidebarOpen(false);
  const closeDropdown = () => setShowDropdown(false);

  const handleLogout = () => {
    logout();
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
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchInput}
          />
          <button className="search-btn" onClick={handleSearchSubmit}>Search</button>

          {!isMobile && (
            <div className="nav-buttons">
              <button
                className="btn post-btn"
                onClick={() => {
                  if (isAdmin) {
                    window.location.href = "/admin/users";
                  } else {
                    onPostAdClick();
                  }
                }}
              >
                {isAdmin ? 'Users' : 'Post Ad'}
              </button>

              {user ? (
                <div className="user-avatar" onClick={toggleSidebar}>
                  {avatarLabel}
                </div>
              ) : (
                <button className="btn" onClick={openLogin}>Login/Register</button>
              )}
              <div className="hamburger" onClick={toggleSidebar}>☰</div>
            </div>
          )}

          {isMobile && <div className="hamburger" onClick={toggleSidebar}>☰</div>}
        </div>
      </nav>

      {!isMobile && showDropdown && user && (
        <div className="dropdown-menu">
          <button
            className="btn"
            onClick={() => window.location.href = isAdmin ? "/admin/ads" : "/myads"}
          >
            {isAdmin ? "Ads" : "My Ads"}
          </button>
          <button className="btn" onClick={handleLogout}>Logout</button>
        </div>
      )}

      {isMobile && sidebarOpen && (
        <>
          <div className="overlay" onClick={closeSidebar}></div>
          <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
            {user && <div className="user-avatar sidebar-avatar">{avatarLabel}</div>}

            {user ? (
              <button
                className="btn"
                onClick={() => window.location.href = isAdmin ? "/admin/ads" : "/myads"}
              >
                {isAdmin ? "Ads" : "My Ads"}
              </button>
            ) : (
              <button className="btn" onClick={openLogin}>Login/Register</button>
            )}

            <button
              className="btn post-btn"
              onClick={() => {
                if (isAdmin) {
                  window.location.href = "/admin/users";
                } else {
                  onPostAdClick();
                }
                closeSidebar();
              }}
              disabled={!user}
            >
              {isAdmin ? 'Users' : 'Post Ad'}
            </button>

            <div className="spacer" style={{ flexGrow: 1 }}></div>

            {user && <button className="btn logout-btn" onClick={handleLogout}>Logout</button>}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
