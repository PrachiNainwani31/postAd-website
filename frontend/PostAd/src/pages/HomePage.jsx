import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import AdCard from '../components/AdCard';
import Footer from '../components/Footer';
import '../styles/HomePage.css';
const adsPerPage = 12;
const dummyAds=[
  { id: 1, title: "Dell Laptop", price: "48,000", location: "Delhi", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 2, title: "Job Vacancy", price: "500/hr", location: "Mumbai", image: "https://th.bing.com/th/id/OIP.0Vid-4GQvVJqTfmPC1I9SQHaHa?w=208&h=208&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3" },
  { id: 3, title: "Washing Machine", price: "10,000", location: "Kota", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 4, title: "Sofa Set", price: "15,000", location: "Jaipur", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 5, title: "AC", price: "20,000", location: "Noida", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 6, title: "TV", price: "12,000", location: "Delhi", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 7, title: "Table", price: "3,000", location: "Indore", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 8, title: "Fan", price: "1,000", location: "Bhopal", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 9, title: "Refrigerator", price: "22,000", location: "Kanpur", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 10, title: "Washing Machine", price: "11,000", location: "Agra", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 10, title: "Washing Machine", price: "11,000", location: "Agra", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" },
  { id: 10, title: "Washing Machine", price: "11,000", location: "Agra", image: "https://apollo.olx.in/v1/files/icnej111jgju1-IN/image;s=780x0;q=60" }
]
const HomePage = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(dummyAds.length / adsPerPage);

  const indexOfLastAd = currentPage * adsPerPage;
  const indexOfFirstAd = indexOfLastAd - adsPerPage;
  const currentAds = dummyAds.slice(indexOfFirstAd, indexOfLastAd);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };
  return (
    <>
    <Navbar/>
    <div className="home-container">

        <div className="category-bar">
  <p className="category-title" onClick={() => setDropdownOpen(!dropdownOpen)}>
    <strong>CATEGORIES</strong>
  </p>
  <div className="category-buttons desktop-only">
    <button>Services</button>
    <button>Business Promotion</button>
    <button>Sales</button>
    <button>Jobs</button>
  </div>

  {dropdownOpen && (
    <div className="category-dropdown mobile-only">
      <button>Services</button>
      <button>Business Promotion</button>
      <button>Sales</button>
      <button>Jobs</button>
    </div>
  )}
</div>

        <div className="ads-grid">
          {currentAds.map((ad) => (
            <AdCard key={ad.id} ad={ad} />
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
    </>
  )
}

export default HomePage
