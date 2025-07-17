import React, { useState,useEffect,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import Footer from '../components/Footer';
import '../styles/HomePage.css';
import LoginModal from '../pages/LoginPage';
import RegisterModal from '../components/RegisterModal';
import { AuthContext } from '../context/AuthContext';

const adsPerPage = 12;


const HomePage = ({ searchQuery }) => {
  const [ads, setAds] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);


const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

 const filteredAds = ads.filter(ad =>
  (!selectedCategory || ad.category === selectedCategory) &&
  ad.title.toLowerCase().includes(searchQuery.toLowerCase())
);

const totalPages = Math.ceil(filteredAds.length / adsPerPage);
const indexOfLastAd = currentPage * adsPerPage;
const indexOfFirstAd = indexOfLastAd - adsPerPage;
const currentAds = filteredAds.slice(indexOfFirstAd, indexOfLastAd);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleCategoryClick = (category) => {
  setSelectedCategory(category);
  setCurrentPage(1); // reset to first page when filtering
};

  const handlePostAdClick = () => {
    if (!user) {
      setShowLogin(true);
    } else {
      navigate('/post-ad');
    }
  };

  useEffect(() => {
  fetch('http://localhost:5001/api/ads')
    .then(res => res.json())
    .then(data => setAds(data))
    .catch(err => console.log(err));
}, []);


  return (
    <>
      <div className="home-container">
        <div className="category-bar">
          <p className="category-title" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <strong>CATEGORIES</strong>
          </p>
          <div className="category-buttons desktop-only">
  {["Services", "Business Promotion", "Sales", "Jobs"].map((cat) => (
    <button
      key={cat}
      onClick={() => handleCategoryClick(cat)}
      className={selectedCategory === cat ? 'active-category' : ''}
    >
      {cat}
    </button>
  ))}
</div>
          {dropdownOpen && (
  <div className="category-dropdown mobile-only">
    {["Services", "Business Promotion", "Sales", "Jobs"].map((cat) => (
      <button
        key={cat}
        onClick={() => handleCategoryClick(cat)}
        className={selectedCategory === cat ? 'active-category' : ''}
      >
        {cat}
      </button>
    ))}
  </div>
)}</div>

{selectedCategory && (
  <button className="clear-filter-btn" onClick={() => setSelectedCategory(null)}>
    Show All
  </button>
)}
        <div className="ads-grid">
          {currentAds.map((ad, index) => (
  <AdCard key={ad._id || ad.id || index} ad={ad} />
))}

        </div>

        <div className="pagination">
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              className={currentPage === index + 1 ? 'active-page' : ''}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>

        <p className="current-page-label">Current page: {currentPage}</p>
      </div>

      <Footer />

      {showLogin && (
        <LoginModal
          close={() => setShowLogin(false)}
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
          // setUser={setUser}
        />
      )}

      {showRegister && (
        <RegisterModal
          close={() => setShowRegister(false)}
          switchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
          // setUser={setUser}
        />
      )}
    </>
  );
};

export default HomePage;
